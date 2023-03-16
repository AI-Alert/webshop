import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthGuardType } from '@constants/auth.constant';
import { PassportStrategy } from '@nestjs/passport';
import { UserAuthService } from '@src/user/auth/services';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(
  Strategy,
  AuthGuardType.LocalUser,
) {
  constructor(private readonly _userAuthService: UserAuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = this._userAuthService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
