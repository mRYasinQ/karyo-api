import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { Logger } from 'nestjs-pino';

import setupSwagger from './configs/swagger.config';

import AppModule from './modules/app.module';

import type { EnvConfig } from './shared/schemas/env.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const corsOrigins = config.get<EnvConfig['CORS_ORIGINS']>('app.cors_origins');
  const enableSwagger = config.getOrThrow<EnvConfig['ENABLE_SWAGGER']>('app.enable_swagger');
  const url = config.getOrThrow<EnvConfig['APP_URL']>('app.url');
  const port = config.getOrThrow<EnvConfig['APP_PORT']>('app.port');

  if (corsOrigins) {
    app.enableCors({
      origin: corsOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: corsOrigins === '*' ? false : true,
    });
  }

  if (enableSwagger) setupSwagger(app, url);

  await app.listen(port);
}

void bootstrap();
