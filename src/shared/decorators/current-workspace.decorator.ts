import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

const CurrentWorkspace = createParamDecorator((data: never, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  const request = http.getRequest<Request>();

  const activeWorkspace = request.activeWorkspace;

  return activeWorkspace;
});

export default CurrentWorkspace;
