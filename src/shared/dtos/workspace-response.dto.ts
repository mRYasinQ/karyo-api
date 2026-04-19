import { HttpStatus } from '@nestjs/common';

import CommonMessage from '../constants/common-message';
import { createErrorResponse } from '../utils/create-response-dto';

class NotFoundWorkspaceException extends createErrorResponse(CommonMessage.WORKSPACE_NOT_FOUND, HttpStatus.NOT_FOUND) {}

export { NotFoundWorkspaceException };
