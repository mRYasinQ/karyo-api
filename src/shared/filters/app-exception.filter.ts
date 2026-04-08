import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';

import type { Response } from 'express';
import { Logger } from 'nestjs-pino';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

import CommonMessage from '../constants/common-message';

@Catch()
class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = CommonMessage.INTERNAL_SERVER;

    if (exception instanceof ZodValidationException) {
      const zodException = exception.getZodError();
      if (zodException instanceof ZodError) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = zodException.issues[0].message;
      }
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const isNotFoundError = statusCode === HttpStatus.NOT_FOUND && exception.message.startsWith('Cannot');
      message = isNotFoundError ? CommonMessage.NOT_FOUND : exception.message;
    } else {
      this.logger.error(exception);
    }

    response.status(statusCode).json({
      status_code: statusCode,
      error: message,
    });
  }
}

export default AppExceptionFilter;
