import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserVerificationEntity } from '@src/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthController } from '@src/user/auth/controllers';
import { RepositoryService } from '@src/user/auth/providers';
import { UserAuthService } from '@src/user/auth/services';
import { UserApiService } from '@src/user/api/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserVerificationEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: config.get('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserAuthController],
  providers: [RepositoryService, UserAuthService, UserApiService],
  exports: [UserAuthService, UserApiService],
})
export class UserModule {}
