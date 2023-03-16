import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AdminEntity } from '@src/entities';
import { JwtStrategy, LocalAdminStrategy } from '@src/auth/strategies';
import { LocalUserStrategy } from '@src/auth/strategies/local.user.strategy';
import { AdminModule } from '@src/admin/admin.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: config.get('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    AdminModule,
    UserModule,
    PassportModule,
  ],
  providers: [LocalAdminStrategy, LocalUserStrategy, JwtStrategy],
})
export class AuthModule {}
