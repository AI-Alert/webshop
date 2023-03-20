import { Module } from '@nestjs/common';
import {
  AdminEntity,
  BrandEntity,
  CategoryEntity,
  ProductEntity,
  ReviewEntity,
  UserEntity,
} from '@src/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuthController } from '@src/admin/auth/controllers';
import { AdminAuthService } from '@src/admin/auth/services';
import { RepositoryService } from '@src/admin/auth/providers';
import { AdminManagementService } from '@src/admin/management/services';
import { AdminManagementController } from '@src/admin/management/controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity,
      ProductEntity,
      BrandEntity,
      CategoryEntity,
      UserEntity,
      ReviewEntity,
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
  controllers: [AdminAuthController, AdminManagementController],
  providers: [AdminAuthService, RepositoryService, AdminManagementService],
  exports: [AdminAuthService],
})
export class AdminModule {}
