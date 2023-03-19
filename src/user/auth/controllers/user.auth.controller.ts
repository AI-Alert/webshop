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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { UserAuthService } from '@src/user/auth/services';
import { LocalUserAuthGuard, JwtAuthUserGuardRedis } from '@src/auth/guards';
import { CreatePasswordDto, RegisterDto } from '@src/user/auth/dto';

import { TokenPair } from '@constants/auth.constant';
import { UserEntity } from '@src/entities';

@ApiTags('User Authentication')
@Controller('user/auth')
export class UserAuthController {
  constructor(private readonly _userAuthService: UserAuthService) {}

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
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalUserAuthGuard)
  async login(@Request() req): Promise<TokenPair> {
    return this._userAuthService.login(req.user);
  }

  @ApiBody({
    required: true,
    examples: {
      test: {
        summary: 'A testing example.',
        value: {
          refreshToken: 'superSecretToken',
        },
      },
    },
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    return this._userAuthService.refresh(body.refreshToken);
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(JwtAuthUserGuardRedis)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const accessToken = req.headers['authorization'].replace('Bearer ', '');
    return this._userAuthService.logout(accessToken);
  }
  @Post('create-password')
  @HttpCode(HttpStatus.OK)
  async createPassword(
    @Body() createPasswordDto: CreatePasswordDto,
  ): Promise<TokenPair> {
    return this._userAuthService.createPassword(createPasswordDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new Error(`Passwords don't match`);
    }
    return this._userAuthService.register(registerDto);
  }
}
