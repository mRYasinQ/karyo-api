import { applyDecorators, HttpCode, HttpStatus, type Type } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

import SuccessMessage from './success-message.decorator';

interface ApiStandardOptions {
  status: HttpStatus;
  successMessage: string;
  summary?: string;
  mimeTypes?: string[];
  type?: Type<unknown> | string;
}

const ApiStandard = (options: ApiStandardOptions) => {
  const { status, successMessage, mimeTypes, summary, type } = options;

  const mimeTypesData = mimeTypes ? mimeTypes : ['application/x-www-form-urlencoded', 'application/json'];

  return applyDecorators(
    HttpCode(status),
    SuccessMessage(successMessage),
    ApiOperation({ summary }),
    ApiConsumes(...mimeTypesData),
    ApiResponse({ status, type }),
  );
};

export type { ApiStandardOptions };
export default ApiStandard;
