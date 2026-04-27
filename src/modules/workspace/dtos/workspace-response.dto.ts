import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { WorkspaceRole } from '@/shared/constants/workspace-role';
import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import FlattenUser from '../decorators/flatten-user.decorator';
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

class WorkspaceMemberData {
  @FlattenUser('id')
  id: number;

  @FlattenUser('createdAt', { name: 'created_at', format: 'date-time' })
  createdAt: string;

  @FlattenUser('firstName', { name: 'first_name' })
  firstName: string;

  @FlattenUser('lastName', { name: 'last_name' })
  lastName: string;

  @FlattenUser('username')
  username: string;

  @FlattenUser('avatar')
  @ToStorageUrl()
  avatar: string;

  @FlattenUser('birthday', { format: 'date' })
  birthday: string;

  @Expose({ name: 'role' })
  @ApiProperty({ name: 'workspace_role', enum: WorkspaceRole })
  workspaceRole: WorkspaceRole;

  @Expose()
  @ApiProperty({ name: 'joined_at', format: 'date-time' })
  joinedAt: Date;

  @Exclude()
  user: unknown;
}

class CreateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_CREATED, HttpStatus.CREATED) {}
class UpdateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_UPDATED) {}
class DeleteWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_DELETED) {}

class GetWorkspacesResponseDto extends createPaginatedResponse(WorkspaceData, WorkspaceMessage.WORKSPACES_GET) {}
class GetInvitationsResponseDto extends createPaginatedResponse(WorkspaceData, WorkspaceMessage.INVITATIONS_GET) {}
class GetWorkspaceResponseDto extends createDataResponse(WorkspaceData, WorkspaceMessage.WORKSPACE_GET) {}
class InviteMemberResponseDto extends createBaseResponse(WorkspaceMessage.INVITE_SENT) {}
class InviteMemberRespondResponseDto extends createBaseResponse(WorkspaceMessage.INVITE_RESPONSE_SENT) {}

class GetMembersWorkspaceResponseDto extends createPaginatedResponse(WorkspaceMemberData, WorkspaceMessage.MEMBERS_GET) {}
class UpdateRoleMemberResponseDto extends createBaseResponse(WorkspaceMessage.MEMBER_ROLE_UPDATED) {}
class RemoveMemberResponseDto extends createBaseResponse(WorkspaceMessage.MEMBER_REMOVED) {}
class LeaveWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.MEMBER_LEAVED) {}

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
  GetMembersWorkspaceResponseDto,
  UpdateRoleMemberResponseDto,
  RemoveMemberResponseDto,
  LeaveWorkspaceResponseDto,
  SlugExistResponseDto,
  AlreadyMemberResponseDto,
};
