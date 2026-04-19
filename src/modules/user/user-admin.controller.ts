import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import type { Request } from 'express';

import STORAGE_FOLDERS from '@/shared/constants/storage-folders';
import ApiStandard from '@/shared/decorators/api-standard.decorator';
import FileValidationPipe from '@/shared/pipes/file-validation.pipe';

import StorageService from '../storage/providers/storage.service';
import { CreateUserDto, GetUsersQueryDto, UpdateUserDto } from './dtos/user.dto';
import {
  CreateUserAdminResponseDto,
  DeleteUserAdminResponseDto,
  EmailExistResponseDto,
  GetUserAdminResponseDto,
  GetUsersAdminResponseDto,
  NotFoundUserResponseDto,
  NotFoundUserRoleResponseDto,
  UpdateUserAdminResponseDto,
} from './dtos/user-response.dto';
import UserMessage from './user.message';
import UserService from './user.service';

@Controller('admin/users')
class UserAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: UserMessage.USERS_GET,
    summary: 'Get users',
    type: GetUsersAdminResponseDto,
    permissions: ['SHOW_USER'],
  })
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.userService.findAll(query);
  }

  @Get('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: UserMessage.USER_GET,
    summary: 'Get user',
    type: GetUserAdminResponseDto,
    permissions: ['SHOW_USER'],
  })
  @ApiNotFoundResponse({ type: NotFoundUserResponseDto })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOneById(id, { populate: ['role.*'] });
    if (!user) throw new NotFoundException(UserMessage.NOT_FOUND);

    return user;
  }

  @Post()
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: UserMessage.USER_CREATED,
    summary: 'Create user',
    type: CreateUserAdminResponseDto,
    mimeTypes: ['multipart/form-data'],
    permissions: ['CREATE_USER'],
    file: { name: 'avatar' },
  })
  @ApiNotFoundResponse({ type: NotFoundUserRoleResponseDto })
  @ApiConflictResponse({
    type: EmailExistResponseDto,
    examples: {
      UserNotFound: {
        summary: 'Email exist',
        value: { status_code: HttpStatus.CONFLICT, error: UserMessage.EMAIL_EXIST },
      },
      SelectedRoleNotFound: {
        summary: 'Username exist',
        value: { status_code: HttpStatus.CONFLICT, error: UserMessage.USERNAME_EXIST },
      },
    },
  })
  async createUser(
    @Req() req: Request,
    @Body() body: CreateUserDto,
    @UploadedFile(new FileValidationPipe({ allowedTypes: ['image/png', 'image/jpeg', 'image/webp'] }))
    file?: Express.Multer.File,
  ) {
    if (file) {
      const fileKey = await this.storageService.uploadFile(file, STORAGE_FOLDERS.AVATARS);
      req.uploadedFileKey = fileKey;
      body.avatar = fileKey;
    }
    const result = await this.userService.create(body);

    return result;
  }

  @Patch('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: UserMessage.USER_UPDATED,
    summary: 'Update user',
    type: UpdateUserAdminResponseDto,
    mimeTypes: ['multipart/form-data'],
    permissions: ['UPDATE_USER'],
    file: { name: 'avatar' },
  })
  @ApiNotFoundResponse({
    type: NotFoundUserResponseDto,
    examples: {
      UserNotFound: {
        summary: 'User not-found',
        value: { status_code: HttpStatus.NOT_FOUND, error: UserMessage.NOT_FOUND },
      },
      SelectedRoleNotFound: {
        summary: 'Selected role not-found',
        value: { status_code: HttpStatus.NOT_FOUND, error: UserMessage.ROLE_NOT_FOUND },
      },
    },
  })
  @ApiConflictResponse({
    type: EmailExistResponseDto,
    examples: {
      UserNotFound: {
        summary: 'Email exist',
        value: { status_code: HttpStatus.CONFLICT, error: UserMessage.EMAIL_EXIST },
      },
      SelectedRoleNotFound: {
        summary: 'Username exist',
        value: { status_code: HttpStatus.CONFLICT, error: UserMessage.USERNAME_EXIST },
      },
    },
  })
  async updateUser(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
    @UploadedFile(new FileValidationPipe({ allowedTypes: ['image/png', 'image/jpeg', 'image/webp'] }))
    file?: Express.Multer.File,
  ) {
    if (file) {
      const fileKey = await this.storageService.uploadFile(file, STORAGE_FOLDERS.AVATARS);
      req.uploadedFileKey = fileKey;
      body.avatar = fileKey;
    }
    const result = await this.userService.update(id, body);

    return result;
  }

  @Delete('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: UserMessage.USER_DELETED,
    summary: 'Delete user',
    type: DeleteUserAdminResponseDto,
    permissions: ['DELETE_USER'],
  })
  @ApiNotFoundResponse({ type: NotFoundUserResponseDto })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

export default UserAdminController;
