import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import SessionMessage from '../session.message';

class SessionData {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ name: 'created_at', format: 'date-time' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ name: 'updated_at', format: 'date-time' })
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  browser: string;

  @Expose()
  @ApiProperty()
  os: string;

  @Expose()
  @ApiProperty({ name: 'is_current' })
  isCurrent: boolean;

  @Expose()
  @ApiProperty({ name: 'expire_at', format: 'date-time' })
  expireAt: Date;
}

class GetSessionsResponseDto extends createPaginatedResponse(SessionData, SessionMessage.SESSIONS_GET) {}
class GetSessionResponseDto extends createDataResponse(SessionData, SessionMessage.SESSION_GET) {}
class ClearSessionResponseDto extends createBaseResponse(SessionMessage.SESSIONS_CLEAR) {}
class DeleteSessionResponseDto extends createBaseResponse(SessionMessage.SESSION_DELETE) {}

class NotFoundResponseDto extends createErrorResponse(SessionMessage.NOT_FOUND, HttpStatus.NOT_FOUND) {}
class DeleteCurrentSessionResponseDto extends createErrorResponse(SessionMessage.CANNOT_DELETE_CURRENT_SESSION, HttpStatus.BAD_REQUEST) {}

export {
  GetSessionsResponseDto,
  GetSessionResponseDto,
  ClearSessionResponseDto,
  DeleteSessionResponseDto,
  NotFoundResponseDto,
  DeleteCurrentSessionResponseDto,
};
