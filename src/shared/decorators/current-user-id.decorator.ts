import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

const CurrentUserId = createParamDecorator((data: never, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  const request = http.getRequest<Request>();

  const userId = request.userId;

  return userId;
});

export default CurrentUserId;
