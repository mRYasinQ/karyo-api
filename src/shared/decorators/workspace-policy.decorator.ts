import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import WorkspaceGuard from '@/modules/workspace/guards/workspace.guard';

import { WorkspaceRole } from '../constants/workspace-role';
import ForbiddenResponseDto from '../dtos/forbidden-response.dto';
import { NotFoundWorkspaceException } from '../dtos/workspace-response.dto';

interface WorkspacePolicyOptions {
  roles?: WorkspaceRole[];
  requireActive?: boolean;
}

const WORKSPACE_POLICY_KEY = 'workspace_policy';

const SetWorkspacePolicy = (options: WorkspacePolicyOptions = { requireActive: true }) => {
  return applyDecorators(
    SetMetadata(WORKSPACE_POLICY_KEY, options),
    UseGuards(WorkspaceGuard),
    ApiNotFoundResponse({ type: NotFoundWorkspaceException }),
    ApiForbiddenResponse({ type: ForbiddenResponseDto }),
  );
};

export { WORKSPACE_POLICY_KEY };
export type { WorkspacePolicyOptions };
export default SetWorkspacePolicy;
