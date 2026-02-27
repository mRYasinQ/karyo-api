import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';

import CommonMessage from '@/shared/constants/common-message';

import AuthService from '../auth.service';
import { OPTIONAL_AUTH_KEY } from '../decorators/optional-auth.decorator';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextHandler = context.getHandler();
    const contextClass = context.getClass();

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();

    const authorizationHeader = request.headers.authorization;
    const [tokenType, token] = authorizationHeader?.split(' ') ?? [];

    const isOptional = this.reflector.getAllAndOverride<boolean>(OPTIONAL_AUTH_KEY, [contextHandler, contextClass]);

    try {
      if (tokenType !== 'Bearer' || !token) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

      const { user, ...sessionData } = await this.authService.validateToken(token);

      request.userId = user.id;
      request.currentSession = sessionData;

      return true;
    } catch (error) {
      if (isOptional) return true;
      throw error;
    }
  }
}

export default AuthGuard;
