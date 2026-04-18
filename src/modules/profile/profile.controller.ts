import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Patch, Req, UploadedFile } from '@nestjs/common';
import { ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import type { Request } from 'express';

import STORAGE_FOLDERS from '@/shared/constants/storage-folders';
import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentUserId from '@/shared/decorators/current-user-id.decorator';
import FileValidationPipe from '@/shared/pipes/file-validation.pipe';

import StorageService from '../storage/providers/storage.service';
import UserService from '../user/user.service';
import { GetProfileParamDto, UpdateProfileDto } from './dto/profile.dto';
import {
  NotFoundProfileResponseDto,
  PrivateProfileResponseDto,
  ProfileEmailExistResponseDto,
  PublicProfileResponseDto,
  UpdateProfileResponseDto,
} from './dto/profile-response.dto';
import ProfileMessage from './profile.message';

@Controller('profile')
class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProfileMessage.PROFILE_GET,
    summary: 'Get your profile',
    type: PrivateProfileResponseDto,
    secure: 'required',
  })
  getProfile(@CurrentUserId() userId: number) {
    return this.userService.findOneById(userId, { populate: ['role.*'] });
  }

  @Get('/:username')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProfileMessage.PROFILE_GET,
    summary: 'Get user profile by username',
    type: PublicProfileResponseDto,
  })
  @ApiNotFoundResponse({ type: NotFoundProfileResponseDto })
  async getProfileByUsername(@Param() params: GetProfileParamDto) {
    const user = await this.userService.findOneByUsername(params.username, { populate: ['role.*'] });
    if (!user) throw new NotFoundException(ProfileMessage.NOT_FOUND);

    return user;
  }

  @Patch()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProfileMessage.PROFILE_UPDATED,
    summary: 'Update your profile',
    type: UpdateProfileResponseDto,
    mimeTypes: ['multipart/form-data'],
    secure: 'required',
    file: { name: 'avatar' },
  })
  @ApiConflictResponse({
    type: ProfileEmailExistResponseDto,
    examples: {
      UserNotFound: {
        summary: 'Email exist',
        value: { status_code: HttpStatus.CONFLICT, error: ProfileMessage.EMAIL_EXIST },
      },
      SelectedRoleNotFound: {
        summary: 'Username exist',
        value: { status_code: HttpStatus.CONFLICT, error: ProfileMessage.USERNAME_EXIST },
      },
    },
  })
  async updateProfile(
    @Req() req: Request,
    @Body() body: UpdateProfileDto,
    @CurrentUserId() userId: number,
    @UploadedFile(new FileValidationPipe({ allowedTypes: ['image/png', 'image/jpeg', 'image/webp'] }))
    file?: Express.Multer.File,
  ) {
    let fileKey: string | undefined;

    if (file) {
      fileKey = await this.storageService.uploadFile(file, STORAGE_FOLDERS.AVATARS);
      req.uploadedFileKey = fileKey;
    }
    const result = await this.userService.update(userId, body, fileKey);

    return result;
  }
}

export default ProfileController;
