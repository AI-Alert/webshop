import { JwtService } from '@nestjs/jwt';
import { CreatePasswordDto, RegisterDto } from '@src/user/auth/dto';
import { TokenPair } from '@constants/auth.constant';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserTypes } from '@shared/enums';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RepositoryService } from '@src/user/auth/providers';
import { UserEntity } from '@src/entities';
import {
  CreatePasswordAlreadySetException,
  UserNotFoundException,
} from '@shared/exceptions/auth';
import { compareHash, generateHash } from '@utils/auth.utils';
import omit from 'lodash/omit';
import { UserApiService } from '@src/user/api/services';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly _redisService: RedisService,
    private readonly _repositoryService: RepositoryService,
    private readonly _jwtService: JwtService,
    private readonly _config: ConfigService,
    private readonly _userApiService: UserApiService,
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

  async checkTokenExpiration(accessToken: string): Promise<boolean> {
    const payload: any = this._jwtService.decode(accessToken);
    const user = await this._repositoryService.findByEmail(payload.username);

    const lastResetMs = user.lastPasswordResetDate?.getTime() ?? 0;
    const tokenIssuedMs = payload.iat * 1000;

    return tokenIssuedMs > lastResetMs;
  }

  async register(dto: RegisterDto) {
    const { email, name, password } = dto;
    const hashedPassword = await generateHash(password);
    const user = new UserEntity();
    if (!dto.photoUrl) {
      user.photoUrl =
        'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg';
    }
    user.name = name;
    user.contactName = name;
    user.email = email;
    user.passwordHash = hashedPassword;
    user.cart = await this._userApiService.createCart();
    return this._repositoryService.save(user);
  }
}
