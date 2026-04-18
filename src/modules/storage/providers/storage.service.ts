import path from 'node:path';

import { Injectable, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import aws4 from 'aws4';
import ms, { type StringValue } from 'ms';
import sharp from 'sharp';

import getStorageConfig from '@/configs/storage.config';

import type { EnvConfig } from '@/shared/schemas/env.schema';
import { generateRandomBytes, md5 } from '@/shared/utils/random';

@Injectable()
class StorageService implements OnModuleInit {
  private static instance: StorageService;

  private client: S3Client;
  private bucket: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = config.getOrThrow<EnvConfig['MINIO_BUCKET']>('minio.bucket');
  }

  onModuleInit() {
    StorageService.instance = this;

    const storageConfig = getStorageConfig(this.config);
    this.client = new S3Client(storageConfig);
  }

  public static getUrl(fileKey?: string | null, expiresIn?: StringValue) {
    return this.instance.getFileUrl(fileKey, expiresIn);
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

  getFileUrl(fileKey?: string | null, expiresIn: StringValue = '3d') {
    if (!fileKey) return null;

    const storageUrl = this.config.getOrThrow<string>('app.storage_url');
    const expiresInSeconds = Math.floor(ms(expiresIn) / 1000);

    const url = new URL(`${storageUrl}/${this.bucket}/${fileKey}`);
    url.searchParams.set('X-Amz-Expires', expiresInSeconds.toString());

    const opts: aws4.Request = {
      service: 's3',
      region: 'us-east-1',
      method: 'GET',
      protocol: url.protocol,
      host: url.host,
      path: url.pathname + url.search,
      signQuery: true,
    };

    const signed = aws4.sign(opts, {
      accessKeyId: this.config.getOrThrow<string>('minio.username'),
      secretAccessKey: this.config.getOrThrow<string>('minio.password'),
    });

    return `${url.protocol}//${signed.host}${signed.path}`;
  }
}

export default StorageService;
