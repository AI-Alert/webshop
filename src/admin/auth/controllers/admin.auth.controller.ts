import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Req,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AdminAuthService } from '@src/admin/auth/services';
import { LocalAdminAuthGuard } from '@src/auth/guards';
import {
  JwtAuthGuard,
  JwtAuthAdminGuardRedis,
} from '@src/auth/guards/jwt.guard';

import { TokenPair } from '@constants/auth.constant';

import { CreateAdminDto } from '@src/admin/auth/dto';
@ApiTags('Admin Authentication')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly _adminAuthService: AdminAuthService) {}

  @ApiBody({
    required: true,
    examples: {
      test: {
        summary: 'A testing example.',
        value: {
          email: 'test@user.com',
          password: 'IR1descence!',
        },
      },
    },
  })
  @Post('login')
  @UseGuards(LocalAdminAuthGuard)
  async login(@Request() req): Promise<TokenPair> {
    return this._adminAuthService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this._adminAuthService.refresh(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, JwtAuthAdminGuardRedis)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const accessToken = req.headers['authorization'].replace('Bearer ', '');
    return this._adminAuthService.logout(accessToken);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, JwtAuthAdminGuardRedis)
  async register(@Body() body: CreateAdminDto) {
    return this._adminAuthService.register(body);
  }
}
