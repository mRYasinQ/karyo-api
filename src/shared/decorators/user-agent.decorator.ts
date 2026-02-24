import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';

interface UserAgentResult {
  browser: string;
  os: string;
}

const UserAgent = createParamDecorator((data: never, ctx: ExecutionContext): UserAgentResult => {
  const http = ctx.switchToHttp();
  const request = http.getRequest<Request>();
  const userAgentString = request.headers['user-agent'];

  const userAgentParser = new UAParser(userAgentString);
  const result = userAgentParser.getResult();
  const browser = result.browser.name ?? 'Unknown';
  const os = result.os.name ?? 'Unknown';

  return { browser, os };
});

export type { UserAgentResult };
export default UserAgent;
