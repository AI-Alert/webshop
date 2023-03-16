import { JwtService } from '@nestjs/jwt';
import {
  CreatePasswordDto,
  ResetPasswordDto,
  VerifyResetPasswordDto,
} from '@src/user/auth/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPair } from '@constants/auth.constant';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserTypes } from '@shared/enums';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { RepositoryService } from '@src/user/auth/providers';
import { UserEntity, UserVerificationEntity } from '@src/entities';
import {
  CreatePasswordAlreadySetException,
  ResetPasswordNotRequestedException,
  TooManyRequestsException,
  UserNotFoundException,
  WrongCodeException,
} from '@shared/exceptions/auth';
import {
  compareHash,
  generateHash,
  generateVerificationCode,
} from '@utils/auth.utils';
import omit from 'lodash/omit';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserVerificationEntity)
    private readonly _verificationRepository: Repository<UserVerificationEntity>,
    private readonly _redisService: RedisService,
    private readonly _repositoryService: RepositoryService,
    private readonly _jwtService: JwtService,
    private readonly _config: ConfigService,
  ) {
    this._jwtRedisClient = this._redisService.getClient(
      this._config.get('redis.jwtClient'),
    );

    this._jwtRefreshRedisClient = this._redisService.getClient(
      this._config.get('redis.jwtRefreshClient'),
    );
  }

  private readonly _jwtRedisClient: Redis;
  private readonly _jwtRefreshRedisClient: Redis;

  /**
   * Handles User validation
   *
   * @param email
   * @param pass
   * @returns succes or fail comparing
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this._repositoryService.findByEmail(email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException();
    }

    const isValid = await compareHash(pass, user.passwordHash);
    if (isValid) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Handles Admin login
   *
   * @param user
   * @returns new tokens
   */
  async login(user: UserEntity): Promise<TokenPair> {
    const payload = { username: user.email, id: user.id };

    const accessToken = this._jwtService.sign(payload);
    const refreshToken = this._jwtService.sign({
      ...payload,
      createdAt: user.createdAt,
    });

    const tokenPair = { refreshToken, accessToken };
    const accessResponse = await this._jwtRedisClient.setex(
      `${UserTypes.user}:${accessToken}`,
      this._config.get('redis.expiresInSeconds'),
      refreshToken,
    );

    const refreshResponse = await this._jwtRefreshRedisClient.setex(
      `${UserTypes.user}:${refreshToken}`,
      this._config.get('redis.refreshExpiresInSeconds'),
      accessToken,
    );

    const eitherFailed = accessResponse !== 'OK' || refreshResponse !== 'OK';

    if (eitherFailed) {
      throw new Error(`user storeSession(): unable to set ${user.id}`);
    }

    return tokenPair;
  }

  /**
   * Handles logout
   *
   * @param accessToken
   * @returns success or fail
   */
  async logout(accessToken: string): Promise<number> {
    const refreshToken = await this._jwtRefreshRedisClient.get(
      `${UserTypes.user}:${accessToken}`,
    );

    await this._jwtRedisClient.del(`${UserTypes.user}:${accessToken}`);
    return this._jwtRefreshRedisClient.del(`${UserTypes.user}:${refreshToken}`);
  }

  async createPassword(dto: CreatePasswordDto): Promise<TokenPair> {
    const { inviteToken, password } = dto;

    const jwtResponse = await this._jwtRedisClient.get(inviteToken);

    if (!jwtResponse) {
      throw new UnauthorizedException();
    }

    const payload = this._jwtService.verify(inviteToken);

    const user = await this._repositoryService.findByEmail(payload.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.passwordHash) {
      throw new CreatePasswordAlreadySetException();
    }

    const passwordHash = await generateHash(password);
    await this._repositoryService.update(payload.id, { passwordHash });
    await this._jwtRedisClient.del(inviteToken);

    return this.login(user);
  }

  /**
   * Refreshes a token pair
   *
   * @param refreshToken
   * @returns a pair of new tokens
   */
  async refresh(refreshToken: string): Promise<TokenPair> {
    const accessToken = await this._jwtRefreshRedisClient.get(
      `${UserTypes.user}:${refreshToken}`,
    );

    if (!accessToken) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.logout(accessToken);

    const value = this._jwtService.decode(accessToken);
    if (typeof value === 'string') {
      throw new UnauthorizedException('Invalid token structure!');
    }

    const payload = omit(value, ['exp']);
    const newAccessToken = this._jwtService.sign(payload, {
      expiresIn: this._config.get('jwt.expiresIn'),
    });
    const newRefreshToken = this._jwtService.sign(payload, {
      expiresIn: this._config.get('jwt.refreshExpiresIn'),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Handles password reset
   *
   * @param resetPasswordDto
   * @returns success or fail
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const user = await this._repositoryService.findByEmail(
      resetPasswordDto.email,
    );

    if (!user) {
      throw new UserNotFoundException();
    }

    const ONE_MINUTE = 60000;
    const timeSinceLastCodeSent =
      Date.now() -
        user.verification.lastPasswordVerificationCodeSentAt?.getTime() ?? 0;
    if (timeSinceLastCodeSent < ONE_MINUTE) {
      throw new TooManyRequestsException({
        method: 'reset-password',
        timeLeft: ONE_MINUTE - timeSinceLastCodeSent,
      });
    }

    const passwordVerificationCode = generateVerificationCode();
    await this._verificationRepository.update(
      { id: user.verification.id },
      {
        passwordVerificationCode,
        lastPasswordVerificationCodeSentAt: new Date(),
      },
    );

    return true;
  }

  private getInviteToken(payload: { id: number; email: string }) {
    const inviteExpiration = this._config.get('jwt.inviteExpiresIn');

    return this._jwtService.sign(payload, {
      expiresIn: inviteExpiration,
    });
  }

  async verifyResetPassword(
    verifyResetPasswordDto: VerifyResetPasswordDto,
  ): Promise<string> {
    const user = await this._repositoryService.findByEmail(
      verifyResetPasswordDto.email,
    );

    if (!user) {
      throw new UserNotFoundException();
    }
    if (!user.verification.passwordVerificationCode) {
      throw new ResetPasswordNotRequestedException();
    }

    const isDevelopment = ['development', 'local'].includes(
      this._config.get('NODE_ENV'),
    );
    const developmentCodeEntered =
      isDevelopment && verifyResetPasswordDto.verificationCode === '000000';

    const codeValid =
      developmentCodeEntered ||
      verifyResetPasswordDto.verificationCode ===
        user.verification.passwordVerificationCode;
    if (!codeValid) {
      throw new WrongCodeException({ method: 'verify-reset-password' });
    }

    await this._repositoryService.update(user.id, {
      passwordHash: null,
      lastPasswordResetDate: new Date(),
    });

    await this._verificationRepository.update(
      { id: user.verification.id },
      {
        passwordVerificationCode: null,
        lastPasswordVerificationCodeSentAt: null,
      },
    );

    const payload = { id: user.id, email: user.email };

    const token = this.getInviteToken(payload);
    this._jwtRedisClient.set(token, user.email);
    return token;
  }

  async checkTokenExpiration(accessToken: string): Promise<boolean> {
    const payload: any = this._jwtService.decode(accessToken);
    const user = await this._repositoryService.findByEmail(payload.username);

    const lastResetMs = user.lastPasswordResetDate?.getTime() ?? 0;
    const tokenIssuedMs = payload.iat * 1000;

    return tokenIssuedMs > lastResetMs;
  }
}
