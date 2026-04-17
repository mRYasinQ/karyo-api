import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import type { Request } from 'express';
import { catchError, Observable, throwError } from 'rxjs';

import StorageProducer from '../providers/storage.producer';

@Injectable()
class UploadCleanup implements NestInterceptor {
  constructor(private readonly storageProducer: StorageProducer) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();

        const key = req.uploadedFileKey;
        if (key) {
          const keysToDelete = Array.isArray(key) ? key : [key];
          void Promise.all(keysToDelete.map((key) => this.storageProducer.deleteFile({ fileKey: key })));
        }

        return throwError(() => err);
      }),
    );
  }
}

export default UploadCleanup;
