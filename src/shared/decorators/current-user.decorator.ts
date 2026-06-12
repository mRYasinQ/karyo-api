import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

import type { Permission } from '../constants/permission';
import type { Session } from '../types/global';

interface CurrentUserData {
  id: number;
  session: Session;
  permissions: Permission[];
}
type CurrentUserKey = keyof CurrentUserData;

const CurrentUser = createParamDecorator((data: CurrentUserKey | undefined, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  const request = http.getRequest<Request>();

  if (data === 'id') return request.userId;
  if (data === 'session') return request.currentSession;
  if (data === 'permissions') return request.userPermissions;

  return {
    id: request.userId,
    session: request.currentSession,
    permissions: request.userPermissions,
  } as CurrentUserData;
});

export type { CurrentUserData };
export default CurrentUser;
