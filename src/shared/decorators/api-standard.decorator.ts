import { applyDecorators, HttpCode, HttpStatus, type Type, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import OptionalAuth from '@/modules/auth/decorators/optional-auth.decorator';
import AuthGuard from '@/modules/auth/guards/auth.guard';

import UnauthorizedResponseDto from '../dtos/unauthorized-response.dto';
import SuccessMessage from './success-message.decorator';

interface ApiStandardOptions {
  status: HttpStatus;
  successMessage: string;
  summary?: string;
  mimeTypes?: string[];
  type?: Type<unknown> | string;
  secure?: 'required' | 'optional' | 'no';
}

const ApiStandard = (options: ApiStandardOptions) => {
  const {
    status,
    successMessage,
    mimeTypes = ['application/x-www-form-urlencoded', 'application/json'],
    summary,
    type,
    secure = 'no',
  } = options;

  const decorators = [
    HttpCode(status),
    SuccessMessage(successMessage),
    ApiOperation({ summary }),
    ApiConsumes(...mimeTypes),
    ApiResponse({ status, type }),
  ];

  if (secure !== 'no') {
    decorators.push(ApiBearerAuth());
    decorators.push(UseGuards(AuthGuard));

    if (secure === 'required') {
      decorators.push(ApiUnauthorizedResponse({ type: UnauthorizedResponseDto }));
    } else {
      decorators.push(OptionalAuth());
    }
  }

  return applyDecorators(...decorators);
};

export type { ApiStandardOptions };
export default ApiStandard;
