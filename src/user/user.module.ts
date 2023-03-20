import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BrandEntity,
  CategoryEntity,
  ProductEntity,
  ReviewEntity,
  UserEntity,
} from '@src/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthController } from '@src/user/auth/controllers';
import { RepositoryService } from '@src/user/auth/providers';
import { UserAuthService } from '@src/user/auth/services';
import { UserApiService } from '@src/user/api/services';
import { UserProfileController } from '@src/user/profile/controllers';
import { UserProfileService } from '@src/user/profile/services';
import { UserApiControllers } from '@src/user/api/controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ReviewEntity,
      CategoryEntity,
      BrandEntity,
      ProductEntity,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: config.get('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserAuthController, UserProfileController, UserApiControllers],
  providers: [
    RepositoryService,
    UserAuthService,
    UserApiService,
    UserProfileService,
  ],
  exports: [UserAuthService, UserApiService],
})
export class UserModule {}
