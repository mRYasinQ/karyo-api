import { applyDecorators, UseGuards } from '@nestjs/common';

import SetWorkspacePolicy, { type WorkspacePolicyOptions } from '@/shared/decorators/workspace-policy.decorator';

import ProjectAccessGuard from '../guards/project-access.guard';

const SetProjectPolicy = (options?: WorkspacePolicyOptions) => applyDecorators(SetWorkspacePolicy(options), UseGuards(ProjectAccessGuard));

export default SetProjectPolicy;
