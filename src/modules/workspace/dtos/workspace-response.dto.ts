import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

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

class CreateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_CREATED, HttpStatus.CREATED) {}
class UpdateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_UPDATED) {}
class DeleteWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_DELETED) {}

class GetWorkspacesResponseDto extends createPaginatedResponse(WorkspaceData, WorkspaceMessage.WORKSPACES_GET) {}
class GetInvitationsResponseDto extends createPaginatedResponse(WorkspaceData, WorkspaceMessage.INVITATIONS_GET) {}
class GetWorkspaceResponseDto extends createDataResponse(WorkspaceData, WorkspaceMessage.WORKSPACE_GET) {}
class InviteMemberResponseDto extends createBaseResponse(WorkspaceMessage.INVITE_SENT) {}
class InviteMemberRespondResponseDto extends createBaseResponse(WorkspaceMessage.INVITE_RESPONSE_SENT) {}

class SlugExistResponseDto extends createErrorResponse(WorkspaceMessage.SLUG_EXIST, HttpStatus.CONFLICT) {}
class AlreadyMemberResponseDto extends createErrorResponse(WorkspaceMessage.ALREADY_MEMBER, HttpStatus.BAD_REQUEST) {}

export {
  CreateWorkspaceResponseDto,
  UpdateWorkspaceResponseDto,
  DeleteWorkspaceResponseDto,
  GetWorkspacesResponseDto,
  GetInvitationsResponseDto,
  GetWorkspaceResponseDto,
  InviteMemberResponseDto,
  InviteMemberRespondResponseDto,
  SlugExistResponseDto,
  AlreadyMemberResponseDto,
};
