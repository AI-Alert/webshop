import { Module } from '@nestjs/common';
import { AdminEntity } from '@src/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuthController } from '@src/admin/auth/controllers';
import { AdminAuthService } from '@src/admin/auth/services';
import { RepositoryService } from '@src/admin/auth/providers';

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
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, RepositoryService],
  exports: [AdminAuthService],
})
export class AdminModule {}
