import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { WorkspaceRole } from '@/shared/constants/workspace-role';
import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import FlattenUser from '../decorators/flatten-user.decorator';
import WorkspaceMessage from '../workspace.message';

class PrivateWorkspaceData extends BaseResponseDto {
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

  @Expose({ name: 'role' })
  @ApiProperty({ name: 'workspace_role', enum: WorkspaceRole, nullable: true })
  workspaceRole: WorkspaceRole;

  @Expose()
  @ApiProperty({ nullable: true })
  description: string;
}

class PublicWorkspaceData extends BaseResponseDto {
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

  @FlattenUser('firstName', { name: 'first_name', nullable: true })
  firstName: string;

  @FlattenUser('lastName', { name: 'last_name', nullable: true })
  lastName: string;

  @FlattenUser('username')
  username: string;

  @FlattenUser('avatar', { nullable: true })
  @ToStorageUrl()
  avatar: string;

  @FlattenUser('birthday', { format: 'date', nullable: true })
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

class WorkspaceRoleData {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ enum: WorkspaceRole })
  value: WorkspaceRole;
}

class CreateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_CREATED, HttpStatus.CREATED) {}
class UpdateWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_UPDATED) {}
class DeleteWorkspaceResponseDto extends createBaseResponse(WorkspaceMessage.WORKSPACE_DELETED) {}

class GetWorkspacesResponseDto extends createPaginatedResponse(PrivateWorkspaceData, WorkspaceMessage.WORKSPACES_GET) {}
class GetInvitationsResponseDto extends createPaginatedResponse(PublicWorkspaceData, WorkspaceMessage.INVITATIONS_GET) {}
class GetWorkspaceResponseDto extends createDataResponse(PrivateWorkspaceData, WorkspaceMessage.WORKSPACE_GET) {}
class InviteMemberResponseDto extends createBaseResponse(WorkspaceMessage.INVITE_SENT) {}
class InviteMemberRespondResponseDto extends createBaseResponse(WorkspaceMessage.INVITE_RESPONSE_SENT) {}

class GetMembersWorkspaceResponseDto extends createPaginatedResponse(WorkspaceMemberData, WorkspaceMessage.MEMBERS_GET) {}
class GetWorkspaceRolesResponseDto extends createDataResponse(WorkspaceRoleData, WorkspaceMessage.ROLES_GET, HttpStatus.OK, true) {}
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
  GetWorkspaceRolesResponseDto,
  UpdateRoleMemberResponseDto,
  RemoveMemberResponseDto,
  LeaveWorkspaceResponseDto,
  SlugExistResponseDto,
  AlreadyMemberResponseDto,
};
