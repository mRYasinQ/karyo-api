import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

const CurrentSession = createParamDecorator((data: never, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  const request = http.getRequest<Request>();

  const currentSession = request.currentSession;

  return currentSession;
});

export default CurrentSession;
