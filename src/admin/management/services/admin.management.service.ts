import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { UserEntity } from '@src/entities';
import { UserApiService } from '@src/user/api/services';

@Injectable()
export class AdminManagementService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _config: ConfigService,
    private readonly _redis: RedisService,
    private readonly _userApiService: UserApiService,
  ) {
    this._jwtRedisClient = this._redis.getClient(
      this._config.get('redis.jwtClient'),
    );
  }
  private readonly _jwtRedisClient: Redis;

  async listUsers(
    skip = 0,
    limit = 0,
  ): Promise<{ users: UserEntity[]; amount: number }> {
    const allOrganizations = await this._userApiService.findAll();
    const organizations = await this._userApiService.findAll(skip, limit);
    return {
      users: organizations,
      amount: allOrganizations.length,
    };
  }
}
