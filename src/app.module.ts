import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const connection = configService.get('redis.connection');
        return {
          config: [
            { ...connection, namespace: configService.get('redis.jwtClient') },
            {
              ...connection,
              namespace: configService.get('redis.jwtRefreshClient'),
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
