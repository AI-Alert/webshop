import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  Logger as Log,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from '@utils/swagger.utils';
import { useContainer } from 'class-validator';
import compression from 'compression';
import helmet from 'helmet';
const DEFAULT_PORT = 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Log('Bootstrap');

  setupSwagger(app);

  const reflector = app.get(Reflector);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const http = app.getHttpServer();
  http.setTimeout(180000);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useLogger(logger);
  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  await app.listen(process.env.PORT || DEFAULT_PORT).then(async () => {
    logger.log(`Server listening on ${await app.getUrl()} port`);
  });
}
bootstrap();
