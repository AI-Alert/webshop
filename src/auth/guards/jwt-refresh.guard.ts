import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardType } from '@constants/auth.constant';

@Injectable()
export default class JwtRefreshGuard extends AuthGuard(
  AuthGuardType.JwtRefresh,
) {}
