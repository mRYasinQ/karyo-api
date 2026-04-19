import { HttpStatus } from '@nestjs/common';

import { createBaseResponse, createErrorResponse } from '@/shared/utils/create-response-dto';

import WorkspaceMessage from '../workspace.message';

class CreateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_CREATED, HttpStatus.CREATED) {}
class UpdateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_UPDATED) {}
class DeleteWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_DELETED) {}

class SlugExistResponseDto extends createErrorResponse(WorkspaceMessage.SLUG_EXIST, HttpStatus.CONFLICT) {}

export { CreateWorkspaceResponseDto, UpdateWorkspaceResponseDto, DeleteWorkspaceResponseDto, SlugExistResponseDto };
