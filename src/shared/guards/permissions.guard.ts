import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';

import CommonMessage from '../constants/common-message';
import type { Permission } from '../constants/permission';
import { REQUIRE_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const contextHandler = context.getHandler();
    const contextClass = context.getClass();

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(REQUIRE_PERMISSIONS_KEY, [contextHandler, contextClass]);
    if (!requiredPermissions || !requiredPermissions.length) return true;

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();

    const userPermissions = request.userPermissions;

    const hasPermission = requiredPermissions.every((permission) => userPermissions.includes(permission));
    if (!hasPermission) throw new ForbiddenException(CommonMessage.ACCESS_DENIED);

    return true;
  }
}

export default PermissionsGuard;
