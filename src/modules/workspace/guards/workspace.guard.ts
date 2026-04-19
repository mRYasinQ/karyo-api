import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';

import CommonMessage from '@/shared/constants/common-message';
import { WORKSPACE_POLICY_KEY, type WorkspacePolicyOptions } from '@/shared/decorators/workspace-policy.decorator';

import WorkspaceService from '../workspace.service';

@Injectable()
class WorkspaceGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();

    const userId = request.userId!;

    const workspaceSlug = request.params.slug as string | undefined;
    const workspaceHeaderId = request.headers['x-workspace-id'] as string | undefined;
    const workspaceId = workspaceHeaderId ? parseInt(workspaceHeaderId) : undefined;

    const identifier = workspaceId ?? workspaceSlug;
    if (!identifier) throw new NotFoundException(CommonMessage.WORKSPACE_NOT_FOUND);

    const member = await this.workspaceService.findMemberOfWorkspace(
      { memberId: userId, identity: identifier },
      { populate: ['workspace'], fields: ['workspace.id', 'workspace.slug', 'role', 'isActive'] },
    );
    if (!member) throw new NotFoundException(CommonMessage.WORKSPACE_NOT_FOUND);

    const contextHandler = context.getHandler();
    const contextClass = context.getClass();

    const policy = this.reflector.getAllAndOverride<WorkspacePolicyOptions>(WORKSPACE_POLICY_KEY, [contextHandler, contextClass]);
    if (policy) {
      if (policy.requireActive && !member.isActive) throw new NotFoundException(CommonMessage.WORKSPACE_NOT_FOUND);

      if (policy.roles && policy.roles.length > 0) {
        if (!policy.roles.includes(member.role)) throw new ForbiddenException(CommonMessage.ACCESS_DENIED);
      }
    }

    request.activeWorkspace = { id: member.workspace.id, slug: member.workspace.slug, role: member.role, isActive: member.isActive };

    return true;
  }
}

export default WorkspaceGuard;
