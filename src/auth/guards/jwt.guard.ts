import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuardType } from '@constants/auth.constant';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { UserTypes } from '@shared/enums';
import { UserAuthService } from '@src/user/auth/services';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthGuardType.Jwt) {}

@Injectable()
export class JwtAuthGuardRedis extends AuthGuard(AuthGuardType.Jwt) {
  protected role = UserTypes.user;

  constructor(
    private readonly redisService: RedisService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const superActivate = await super.canActivate(context);
    if (!superActivate) {
      return false;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];

    const payload: any = this.jwtService.decode(token);
    if (payload.createdAt) {
      return false;
    }

    const cacheToken = await this.redisService
      .getClient(this.config.get('redis.jwtClient'))
      .get(`${this.role}:${token}`);

    return cacheToken && this.checkTokenExpiration(token);
  }

  protected async checkTokenExpiration(_accessToken: string) {
    return true;
  }
}

@Injectable()
export class JwtAuthAdminGuardRedis extends JwtAuthGuardRedis {
  role = UserTypes.admin;
}

@Injectable()
export class JwtAuthUserGuardRedis extends JwtAuthGuardRedis {
  constructor(
    redisService: RedisService,
    config: ConfigService,
    reflector: Reflector,
    jwtService: JwtService,
    private readonly organizationAuthService: UserAuthService,
  ) {
    super(redisService, config, reflector, jwtService);
    this.role = UserTypes.user;
  }

  protected async checkTokenExpiration(accessToken: string): Promise<boolean> {
    return this.organizationAuthService.checkTokenExpiration(accessToken);
  }
}
