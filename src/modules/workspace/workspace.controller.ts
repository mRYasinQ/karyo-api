import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, UploadedFile } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';

import type { Request } from 'express';

import STORAGE_FOLDERS from '@/shared/constants/storage-folders';
import { WorkspaceRole } from '@/shared/constants/workspace-role';
import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentUserId from '@/shared/decorators/current-user-id.decorator';
import CurrentWorkspace from '@/shared/decorators/current-workspace.decorator';
import SetWorkspacePolicy from '@/shared/decorators/workspace-policy.decorator';
import FileValidationPipe from '@/shared/pipes/file-validation.pipe';

import type { ActiveWorkspace } from '@/shared/types/global';

import StorageService from '../storage/providers/storage.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dtos/workspace.dto';
import {
  CreateWorkspaceResponseDto,
  DeleteWorkspaceResponseDto,
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
  })
  getWorkspaces() {}

  @Get('/:slug')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: WorkspaceMessage.WORKSPACE_GET,
  })
  getWorkspace() {}

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
