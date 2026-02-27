import { HttpStatus } from '@nestjs/common';

import CommonMessage from '../constants/common-message';
import { createErrorResponse } from '../utils/create-response-dto';

class UnauthorizedResponseDto extends createErrorResponse(CommonMessage.AUTHENTICATION_REQUIRED, HttpStatus.UNAUTHORIZED) {}

export default UnauthorizedResponseDto;
