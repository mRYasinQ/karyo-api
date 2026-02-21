import { ConfigService } from '@nestjs/config';

import type { S3ClientConfig } from '@aws-sdk/client-s3';

import type { EnvConfig } from '@/shared/schemas/env.schema';

const getStorageConfig = (config: ConfigService): S3ClientConfig => ({
  endpoint: config.get<EnvConfig['MINIO_HOST']>('minio.host'),

  credentials: {
    accessKeyId: config.getOrThrow<EnvConfig['MINIO_USER']>('minio.username'),
    secretAccessKey: config.getOrThrow<EnvConfig['MINIO_PASSWORD']>('minio.password'),
  },
});

export default getStorageConfig;
