import type { CallHandler, ExecutionContext, NestInterceptor, Type } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { plainToInstance } from 'class-transformer';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DTO_RESPONSE_KEY } from '../decorators/set-dto-response-decorator';
import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';
import { toSnakeCase } from '../utils/case-transformer';
import type { Pagination } from '../utils/pagination';

interface ApiResponse {
  statusCode: number;
  data?: unknown;
  message: string;
  pagination?: Pagination;
}

@Injectable()
class TransformResponse implements NestInterceptor<unknown, ApiResponse> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const http = context.switchToHttp();
    const contextHandler = context.getHandler();
    const response = http.getResponse<Response>();
    const statusCode = response.statusCode;

    const successMessage = this.reflector.get<string>(SUCCESS_MESSAGE_KEY, contextHandler);
    const dtoClass = this.reflector.get<Type<unknown>>(DTO_RESPONSE_KEY, contextHandler);

    return next.handle().pipe(
      map((data: unknown) => {
        let finalData: unknown = data;
        let pagination: Pagination | undefined = undefined;
        let hasPagination = false;

        if (Array.isArray(data)) {
          finalData = data[0];
          pagination = data[1] as Pagination;
          hasPagination = pagination.limit !== undefined;
        }

        const rawResponse: ApiResponse = {
          statusCode,
          message: successMessage,
          data: finalData,
          pagination,
        };

        let processedResponse: unknown = rawResponse;

        if (dtoClass) {
          processedResponse = plainToInstance(dtoClass, rawResponse, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true,
            groups: hasPagination ? ['paginated'] : [],
          });
        }

        const plainResponseBody = JSON.parse(JSON.stringify(processedResponse)) as Record<string, unknown>;
        const cleanResponseBody = toSnakeCase<ApiResponse>(plainResponseBody);

        return cleanResponseBody;
      }),
    );
  }
}

export default TransformResponse;
