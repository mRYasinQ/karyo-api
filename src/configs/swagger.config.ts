import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { cleanupOpenApiDoc } from 'nestjs-zod';

const setupSwagger = (app: INestApplication, appUrl: string) => {
  const swaggerConfig = new DocumentBuilder()
    .setOpenAPIVersion('3.0.1')
    .setTitle('Karyo API')
    .setDescription('Intelligent workspace management designed to organize tasks, track progress, and boost team productivity.')
    .setContact('Yasin Abbasi', 'https://mryasinq.ir', 'yasinabbasi.y20@gmail.com')
    .setVersion('0.0.1')
    .addServer(appUrl, 'Stage/Production Server')
    .addBearerAuth({ type: 'http', scheme: 'bearer', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, cleanupOpenApiDoc(document), {
    customSiteTitle: 'Karyo API | Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};

export default setupSwagger;
