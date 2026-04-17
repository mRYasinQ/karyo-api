import path from 'node:path';

import { Injectable, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

import getStorageConfig from '@/configs/storage.config';

import type { EnvConfig } from '@/shared/schemas/env.schema';
import { generateRandomBytes, md5 } from '@/shared/utils/random';

@Injectable()
class StorageService implements OnModuleInit {
  private client: S3Client;
  private bucket: string;

  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.bucket = config.getOrThrow<EnvConfig['MINIO_BUCKET']>('minio.bucket');
  }

  onModuleInit() {
    const storageConfig = getStorageConfig(this.config);
    this.client = new S3Client(storageConfig);
  }

  async uploadFile(file: Express.Multer.File, folder?: string) {
    let body = file.buffer;
    let contentType = file.mimetype;
    let ext = path.extname(file.originalname).toLowerCase();

    const isImage = contentType.startsWith('image/');
    const isSvg = contentType === 'image/svg+xml';

    if (isImage && !isSvg) {
      sharp.cache(false);
      body = await sharp(file.buffer).webp({ quality: 80, effort: 4 }).toBuffer();
      contentType = 'image/webp';
      ext = '.webp';
    }

    const hash = md5(generateRandomBytes(16, 'hex') + Date.now());
    const uniqueFileName = `${hash}${ext}`;
    const fileKey = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    const parallelUploads3 = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: fileKey,
        Body: body,
        ContentType: contentType,
      },
    });

    await parallelUploads3.done();

    return fileKey;
  }

  uploadFiles(files: Express.Multer.File[], folder?: string) {
    return Promise.all(files.map((file) => this.uploadFile(file, folder)));
  }

  async deleteFile(fileKey: string) {
    const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: fileKey });
    const result = await this.client.send(command);

    return result;
  }

  getFileUrl(fileKey?: string | null) {
    if (!fileKey) return null;

    const storageUrl = this.config.get<EnvConfig['STORAGE_URL']>('app.storage_url');
    const fileUrl = `${storageUrl}/${fileKey}`;

    return fileUrl;
  }
}

export default StorageService;
