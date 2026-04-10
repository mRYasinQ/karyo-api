import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

const CurrentPermissions = createParamDecorator((data: never, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  const request = http.getRequest<Request>();

  const userPermissions = request.userPermissions;

  return userPermissions;
});

export default CurrentPermissions;
