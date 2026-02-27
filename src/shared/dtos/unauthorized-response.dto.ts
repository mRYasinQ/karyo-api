import { HttpStatus } from '@nestjs/common';

import CommonMessage from '../constants/common-message';
import { createErrorResponse } from '../utils/create-response-dto';

class UnauthorizedResponseDto extends createErrorResponse(CommonMessage.USER_INACTIVE, HttpStatus.UNAUTHORIZED) {}

export default UnauthorizedResponseDto;
