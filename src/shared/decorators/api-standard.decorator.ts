import { applyDecorators, HttpCode, HttpStatus, type Type, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import SetAuthType, { type AuthType } from '@/modules/auth/decorators/auth-type.decorator';

import type { Permission } from '../constants/permission';
import ForbiddenResponseDto from '../dtos/forbidden-response.dto';
import UnauthorizedResponseDto from '../dtos/unauthorized-response.dto';
import PermissionsGuard from '../guards/permissions.guard';
import RequirePermissions from './require-permissions.decorator';
import SetDtoResponse from './set-dto-response-decorator';
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
  permissions?: Permission[];
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
    permissions = [],
  } = options;

  const finalSecure: Secure = permissions.length ? 'required' : secure;

  const decorators = [
    HttpCode(status),
    SuccessMessage(successMessage),
    ApiOperation({ summary }),
    ApiConsumes(...mimeTypes),
    ApiResponse({ status, type }),
    SetAuthType(AUTH_STATE[finalSecure]),
  ];

  if (type) decorators.push(SetDtoResponse(type));

  if (finalSecure !== 'no') decorators.push(ApiBearerAuth());
  if (finalSecure === 'required') decorators.push(ApiUnauthorizedResponse({ type: UnauthorizedResponseDto }));

  if (permissions.length) {
    decorators.push(RequirePermissions(...permissions));
    decorators.push(UseGuards(PermissionsGuard));
    decorators.push(ApiForbiddenResponse({ type: ForbiddenResponseDto }));
  }

  return applyDecorators(...decorators);
};

export type { ApiStandardOptions };
export default ApiStandard;
