import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthGuardType } from '@constants/auth.constant';
import { AdminAuthService } from '@src/admin/auth/services';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  AuthGuardType.LocalAdmin,
) {
  constructor(private _adminAuthService: AdminAuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = this._adminAuthService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
