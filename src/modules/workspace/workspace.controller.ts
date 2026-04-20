import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post, Query, Req, UploadedFile } from '@nestjs/common';
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
  GetWorkspacesQueryDto,
  InviteMemberDto,
  InviteMemberRespondDto,
  UpdateWorkspaceDto,
} from './dtos/workspace.dto';
import {
  AlreadyMemberResponseDto,
  CreateWorkspaceResponseDto,
  DeleteWorkspaceResponseDto,
  GetInvitationsResponseDto,
  GetWorkspaceResponseDto,
  GetWorkspacesResponseDto,
  InviteMemberRespondResponseDto,
  InviteMemberResponseDto,
  SlugExistResponseDto,
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
