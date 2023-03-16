import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';

import omit from 'lodash/omit';

import { TokenPair } from '@constants/auth.constant';
import { AdminEntity } from '@src/entities/admin.entity';
import { compareHash } from '@utils/auth.utils';

import { CreateAdminDto } from '@src/admin/auth/dto';
import { RepositoryService } from '../providers';
import { UserTypes } from '@shared/enums';
import Redis from 'ioredis';

@Injectable()
export class AdminAuthService {
  constructor(
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
   * Handles Admin validation
   *
   * @param email
   * @param pass
   * @returns succes or fail comparing
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this._repositoryService.findByEmail(email);
    // Logic for first user
    if (
      user.email === this._config.get('defaultAdminEmail') &&
      pass === user.passwordHash
    ) {
      const { passwordHash, ...result } = user;
      return result;
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
   * @param admin
   * @returns new tokens
   */
  async login(admin: AdminEntity): Promise<TokenPair> {
    const payload = { username: admin.email, id: admin.id };

    const accessToken = this._jwtService.sign(payload);
    const refreshToken = this._jwtService.sign({
      ...payload,
      createdAt: admin.createdAt,
    });

    const tokenPair = { refreshToken, accessToken };
    const accessResponse = await this._jwtRedisClient.setex(
      `${UserTypes.admin}:${accessToken}`,
      this._config.get('redis.expiresInSeconds'),
      refreshToken,
    );

    const refreshResponse = await this._jwtRefreshRedisClient.setex(
      `${UserTypes.admin}:${refreshToken}`,
      this._config.get('redis.refreshExpiresInSeconds'),
      accessToken,
    );

    const eitherFailed = accessResponse !== 'OK' || refreshResponse !== 'OK';

    if (eitherFailed) {
      throw new Error(`volunteer storeSession(): unable to set ${admin.id}`);
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
      `${UserTypes.admin}:${accessToken}`,
    );

    await this._jwtRedisClient.del(`${UserTypes.admin}:${accessToken}`);
    return this._jwtRefreshRedisClient.del(
      `${UserTypes.admin}:${refreshToken}`,
    );
  }

  /**
   * Refreshes a token pair
   *
   * @param refreshToken
   * @returns a pair of new tokens
   */
  async refresh(refreshToken: string): Promise<TokenPair> {
    const accessToken = await this._jwtRefreshRedisClient.get(
      `${UserTypes.admin}:${refreshToken}`,
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
   * Handles registering of new Admin
   *
   * @param body
   * @returns new admin dto
   */
  async register(body: CreateAdminDto) {
    const admin = await this._repositoryService.create(body);
    return omit(admin, ['passwordHash', 'passwordSalt']);
  }
}
