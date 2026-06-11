import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import type { Request } from 'express';
import { catchError, Observable, throwError } from 'rxjs';

import StorageService from '../providers/storage.service';

@Injectable()
class UploadCleanup implements NestInterceptor {
  constructor(private readonly storageService: StorageService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();

        const key = req.uploadedFileKey;
        if (key) {
          const keysToDelete = Array.isArray(key) ? key : [key];
          void Promise.all(keysToDelete.map((key) => this.storageService.deleteFile(key)));
        }

        return throwError(() => err);
      }),
    );
  }
}

export default UploadCleanup;
