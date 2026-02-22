import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';

interface ApiResponse<T> {
  status_code: number;
  data?: T;
  message: string;
}

@Injectable()
class TransformResponse<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const http = context.switchToHttp();

    const contextHandler = context.getHandler();
    const response = http.getResponse<Response>();

    const statusCode = response.statusCode;
    const successMessage = this.reflector.get<string>(SUCCESS_MESSAGE_KEY, contextHandler);

    return next.handle().pipe(
      map((data: T) => {
        return {
          status_code: statusCode,
          message: successMessage,
          data,
        };
      }),
    );
  }
}

export default TransformResponse;
