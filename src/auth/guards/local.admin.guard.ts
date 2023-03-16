import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardType } from '@constants/auth.constant';

@Injectable()
export class LocalAdminAuthGuard extends AuthGuard(AuthGuardType.LocalAdmin) {}
