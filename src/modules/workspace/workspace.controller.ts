import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import type { Request } from 'express';

import CommonMessage from '@/shared/constants/common-message';
import STORAGE_FOLDERS from '@/shared/constants/storage-folders';
import { WorkspaceRole } from '@/shared/constants/workspace-role';
import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentUserId from '@/shared/decorators/current-user-id.decorator';
import CurrentWorkspace from '@/shared/decorators/current-workspace.decorator';
import SetWorkspacePolicy from '@/shared/decorators/workspace-policy.decorator';
import { NotFoundWorkspaceResponseDto } from '@/shared/dtos/workspace-response.dto';
import FileValidationPipe from '@/shared/pipes/file-validation.pipe';

import type { ActiveWorkspace } from '@/shared/types/global';

import StorageService from '../storage/providers/storage.service';
import {
  CreateWorkspaceDto,
  GetInvitationsQueryDto,
  GetMembersWorkspaceQueryDto,
  GetWorkspacesQueryDto,
  InviteMemberDto,
  InviteMemberRespondDto,
  UpdateRoleMemberDto,
  UpdateWorkspaceDto,
} from './dtos/workspace.dto';
import {
  AlreadyMemberResponseDto,
  CreateWorkspaceResponseDto,
  DeleteWorkspaceResponseDto,
  GetInvitationsResponseDto,
  GetMembersWorkspaceResponseDto,
  GetWorkspaceResponseDto,
  GetWorkspacesResponseDto,
  InviteMemberRespondResponseDto,
  InviteMemberResponseDto,
  LeaveWorkspaceResponseDto,
  RemoveMemberResponseDto,
  SlugExistResponseDto,
  UpdateRoleMemberResponseDto,
  UpdateWorkspaceResponseDto,
} from './dtos/workspace-response.dto';
import WorkspaceMessage from './workspace.message';
import WorkspaceService from './workspace.service';

@Controller('workspaces')
class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.WORKSPACES_GET,
    summary: 'Get active workspaces of user',
    type: GetWorkspacesResponseDto,
    secure: 'required',
  })
  getWorkspaces(@Query() query: GetWorkspacesQueryDto, @CurrentUserId() userId: number) {
    return this.workspaceService.getActiveWorkspaces(userId, query);
  }

  @Get('/invitations')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.INVITATIONS_GET,
    summary: 'Get workspace invitations',
    type: GetInvitationsResponseDto,
    secure: 'required',
  })
  getInvitations(@Query() query: GetInvitationsQueryDto, @CurrentUserId() userId: number) {
    return this.workspaceService.getInvitations(userId, query);
  }

  @Get('/:slug')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.WORKSPACE_GET,
    summary: 'Get workspace',
    type: GetWorkspaceResponseDto,
  })
  @ApiNotFoundResponse({ type: NotFoundWorkspaceResponseDto })
  async getWorkspace(@Param('slug') slug: string) {
    const workspace = await this.workspaceService.findOne({ slug }, { exclude: ['members'] });
    if (!workspace) throw new NotFoundException(CommonMessage.WORKSPACE_NOT_FOUND);

    return workspace;
  }

  @Post('/:slug/invitations')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.INVITE_SENT,
    summary: 'Invite member to workspace',
    type: InviteMemberResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN] })
  @ApiBadRequestResponse({ type: AlreadyMemberResponseDto })
  inviteMembers(@Param('slug') _slug: string, @Body() body: InviteMemberDto, @CurrentWorkspace() currentWorkspace: ActiveWorkspace) {
    return this.workspaceService.inviteMember(currentWorkspace.id, body);
  }

  @Post('/:slug/invitations/respond')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.INVITE_RESPONSE_SENT,
    summary: 'Respond to workspace invitation',
    type: InviteMemberRespondResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: false })
  @ApiBadRequestResponse({ type: AlreadyMemberResponseDto })
  respondToInvitation(
    @Param('slug') _slug: string,
    @Body() body: InviteMemberRespondDto,
    @CurrentUserId() userId: number,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
  ) {
    return this.workspaceService.respondToInvitation(currentWorkspace.id, userId, body);
  }

  @Get('/:slug/members')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.MEMBERS_GET,
    summary: 'Get members of workspace',
    type: GetMembersWorkspaceResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true })
  getMembers(
    @Param('slug') _slug: string,
    @Query() query: GetMembersWorkspaceQueryDto,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
  ) {
    return this.workspaceService.findMembersOfWorkspace(currentWorkspace.id, query);
  }

  @Patch('/:slug/members/:memberId')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.MEMBER_ROLE_UPDATED,
    summary: 'Update role of workspace member',
    type: UpdateRoleMemberResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true, roles: [WorkspaceRole.OWNER] })
  updateMemberRole(
    @Param('slug') _slug: string,
    @Param('memberId') memberId: number,
    @Body() body: UpdateRoleMemberDto,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
  ) {
    return this.workspaceService.updateMemberRole(currentWorkspace.id, memberId, body);
  }

  @Delete('/:slug/members/:memberId')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.MEMBER_REMOVED,
    summary: 'Remove member from workspace',
    type: RemoveMemberResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN] })
  removeMember(
    @Param('slug') _slug: string,
    @Param('memberId') memberId: number,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
    @CurrentUserId() userId: number,
  ) {
    if (memberId === userId) throw new BadRequestException(WorkspaceMessage.CANNOT_REMOVE_SELF);
    return this.workspaceService.removeMember(currentWorkspace.id, memberId, currentWorkspace.role as WorkspaceRole);
  }

  @Post('/:slug/leave')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.MEMBER_LEAVED,
    summary: 'Leave workspace',
    type: LeaveWorkspaceResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true })
  leaveWorkspace(@Param('slug') _slug: string, @CurrentWorkspace() currentWorkspace: ActiveWorkspace, @CurrentUserId() userId: number) {
    return this.workspaceService.leaveMember(currentWorkspace.id, userId);
  }

  @Post()
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: WorkspaceMessage.WORKSPACE_CREATED,
    type: CreateWorkspaceResponseDto,
    summary: 'Create workspace',
    mimeTypes: ['multipart/form-data'],
    secure: 'required',
    file: { name: 'logo' },
  })
  @ApiConflictResponse({ type: SlugExistResponseDto })
  async createWorkspace(
    @Req() req: Request,
    @Body() body: CreateWorkspaceDto,
    @CurrentUserId() userId: number,
    @UploadedFile(new FileValidationPipe({ allowedTypes: ['image/png', 'image/jpeg', 'image/webp'] })) file?: Express.Multer.File,
  ) {
    if (file) {
      const fileKey = await this.storageService.uploadFile(file, STORAGE_FOLDERS.WORKSPACE_LOGOS);
      req.uploadedFileKey = fileKey;
      body.logo = fileKey;
    }

    return this.workspaceService.create(body, userId);
  }

  @Patch('/:slug')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.WORKSPACE_UPDATED,
    type: UpdateWorkspaceResponseDto,
    summary: 'Update workspace',
    mimeTypes: ['multipart/form-data'],
    file: { name: 'logo' },
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true, roles: [WorkspaceRole.OWNER] })
  async updateWorkspace(
    @Req() req: Request,
    @Body() body: UpdateWorkspaceDto,
    @Param('slug') _slug: string,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
    @UploadedFile(new FileValidationPipe({ allowedTypes: ['image/png', 'image/jpeg', 'image/webp'] })) file?: Express.Multer.File,
  ) {
    if (file) {
      const fileKey = await this.storageService.uploadFile(file, STORAGE_FOLDERS.WORKSPACE_LOGOS);
      req.uploadedFileKey = fileKey;
      body.logo = fileKey;
    }

    return this.workspaceService.update(currentWorkspace.id, body);
  }

  @Delete('/:slug')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.WORKSPACE_DELETED,
    summary: 'Delete workspace',
    type: DeleteWorkspaceResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true, roles: [WorkspaceRole.OWNER] })
  deleteWorkspace(@Param('slug') _slug: string, @CurrentWorkspace() currentWorkspace: ActiveWorkspace) {
    return this.workspaceService.delete(currentWorkspace.id);
  }
}

export default WorkspaceController;
