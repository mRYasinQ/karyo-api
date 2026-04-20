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
  const enableSwagger = config.getOrThrow<EnvConfig['ENABLE_SWAGGER']>('app.enable_swagger');
  const url = config.getOrThrow<EnvConfig['APP_URL']>('app.url');
  const port = config.getOrThrow<EnvConfig['APP_PORT']>('app.port');

  if (enableSwagger) setupSwagger(app, url);

  await app.listen(port);
}

void bootstrap();
