import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import setupSwagger from './configs/swagger.config';

import AppModule from './modules/app.module';

import type { EnvConfig } from './shared/schemas/env.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const url = config.getOrThrow<EnvConfig['APP_URL']>('app.url');
  const port = config.getOrThrow<EnvConfig['APP_PORT']>('app.port');

  setupSwagger(app, url);

  await app.listen(port);
}

void bootstrap();
