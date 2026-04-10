import { HttpStatus } from '@nestjs/common';

import CommonMessage from '../constants/common-message';
import { createErrorResponse } from '../utils/create-response-dto';

class ForbiddenResponseDto extends createErrorResponse(CommonMessage.ACCESS_DENIED, HttpStatus.FORBIDDEN) {}

export default ForbiddenResponseDto;
