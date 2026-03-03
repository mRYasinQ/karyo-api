import { applyDecorators, HttpCode, HttpStatus, type Type } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import SetAuthType, { type AuthType } from '@/modules/auth/decorators/auth-type.decorator';

import UnauthorizedResponseDto from '../dtos/unauthorized-response.dto';
import SuccessMessage from './success-message.decorator';

type Secure = 'required' | 'optional' | 'no';
type AuthState = Record<Secure, AuthType>;
interface ApiStandardOptions {
  status: HttpStatus;
  successMessage: string;
  summary?: string;
  mimeTypes?: string[];
  type?: Type<unknown> | string;
  secure?: Secure;
}

const AUTH_STATE: AuthState = { no: 'PUBLIC', required: 'REQUIRED', optional: 'OPTIONAL' };

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
    SetAuthType(AUTH_STATE[secure]),
  ];

  if (secure !== 'no') decorators.push(ApiBearerAuth());
  if (secure === 'required') decorators.push(ApiUnauthorizedResponse({ type: UnauthorizedResponseDto }));

  return applyDecorators(...decorators);
};

export type { ApiStandardOptions };
export default ApiStandard;
