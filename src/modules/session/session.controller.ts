import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentSession from '@/shared/decorators/current-session.decorator';
import CurrentUserId from '@/shared/decorators/current-user-id.decorator';

import type { Session } from '@/shared/types/global';

import { ClearSessionsDto, GetSessionsQueryDto } from './dtos/session.dto';
import {
  ClearSessionResponseDto,
  DeleteCurrentSessionResponseDto,
  DeleteSessionResponseDto,
  GetSessionResponseDto,
  GetSessionsResponseDto,
  NotFoundSessionResponseDto,
} from './dtos/session-response.dto';
import SessionMessage from './session.message';
import SessionService from './session.service';

@Controller('sessions')
class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: SessionMessage.SESSIONS_GET,
    summary: 'Get sessions',
    type: GetSessionsResponseDto,
    secure: 'required',
  })
  getSessions(@Query() query: GetSessionsQueryDto, @CurrentUserId() userId: number, @CurrentSession() currentSession: Session) {
    return this.sessionService.findAllUserSession(query, userId, currentSession.id);
  }

  @Get('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: SessionMessage.SESSION_GET,
    summary: 'Get session',
    type: GetSessionResponseDto,
    secure: 'required',
  })
  @ApiNotFoundResponse({ type: NotFoundSessionResponseDto })
  getSession(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId: number, @CurrentSession() currentSession: Session) {
    return this.sessionService.findOneUserSession(id, userId, currentSession.id);
  }

  @Delete('/:id')
  @ApiNotFoundResponse({ type: NotFoundSessionResponseDto })
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: SessionMessage.SESSION_DELETE,
    summary: 'Delete session',
    type: DeleteSessionResponseDto,
    secure: 'required',
  })
  @ApiBadRequestResponse({ type: DeleteCurrentSessionResponseDto })
  deleteSession(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId: number, @CurrentSession() currentSession: Session) {
    if (id === currentSession.id) throw new BadRequestException(SessionMessage.CANNOT_DELETE_CURRENT_SESSION);
    return this.sessionService.deleteUserSession(id, userId);
  }

  @Post('clear')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: SessionMessage.SESSIONS_CLEAR,
    summary: 'Clear sessions',
    type: ClearSessionResponseDto,
    secure: 'required',
  })
  clearSessions(@Body() body: ClearSessionsDto, @CurrentUserId() userId: number, @CurrentSession() currentSession: Session) {
    return this.sessionService.clearUserSessions(userId, currentSession.id, body);
  }
}

export default SessionController;
