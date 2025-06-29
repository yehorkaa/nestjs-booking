import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { APP_PREFIX, getAppBaseUrl } from './app/lib/app.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(APP_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = parseInt(process.env.PORT || '3000', 10);
  const env = process.env.NODE_ENV;
  await app.listen(port);
  Logger.log(
    `🚀 Public Application is running on: ${getAppBaseUrl(env)}`
  );
}

bootstrap();
