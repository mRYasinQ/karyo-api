import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import WorkspaceMessage from '../workspace.message';

class WorkspaceData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @ToStorageUrl()
  logo: string;

  @Expose()
  @ApiProperty({ nullable: true })
  description: string;
}

class InvitationsData {
  @Expose()
  @ApiProperty({ type: WorkspaceData })
  workspace: WorkspaceData;

  @Expose()
  @ApiProperty({ name: 'joined_at', format: 'date-time' })
  joinedAt: Date;
}

class CreateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_CREATED, HttpStatus.CREATED) {}
class UpdateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_UPDATED) {}
class DeleteWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_DELETED) {}

class GetInvitationsResponseDto extends createPaginatedResponse(InvitationsData, WorkspaceMessage.INVITATIONS_GET) {}
class InviteMemberResponseDto extends createBaseResponse(WorkspaceMessage.INVITE_SENT) {}
class InviteMemberRespondResponseDto extends createBaseResponse(WorkspaceMessage.INVITE_RESPONSE_SENT) {}

class SlugExistResponseDto extends createErrorResponse(WorkspaceMessage.SLUG_EXIST, HttpStatus.CONFLICT) {}
class AlreadyMemberResponseDto extends createErrorResponse(WorkspaceMessage.ALREADY_MEMBER, HttpStatus.BAD_REQUEST) {}

export {
  CreateWorkspaceResponseDto,
  UpdateWorkspaceResponseDto,
  DeleteWorkspaceResponseDto,
  GetInvitationsResponseDto,
  InviteMemberResponseDto,
  InviteMemberRespondResponseDto,
  SlugExistResponseDto,
  AlreadyMemberResponseDto,
};
