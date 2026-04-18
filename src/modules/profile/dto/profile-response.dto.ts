import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { type Permission, PERMISSION_LIST } from '@/shared/constants/permission';
import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse } from '@/shared/utils/create-response-dto';

import ProfileMessage from '../profile.message';

class PrivateProfileRoleData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ enum: PERMISSION_LIST, isArray: true })
  permissions: Permission[];
}

class PublicProfileRoleData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  name: string;
}

class PrivateProfileData extends BaseResponseDto {
  @Expose()
  @ApiProperty({ name: 'first_name', nullable: true })
  firstName: string;

  @Expose()
  @ApiProperty({ name: 'last_name', nullable: true })
  lastName: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty({ format: 'email' })
  email: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @ToStorageUrl()
  avatar: string;

  @Expose()
  @ApiProperty({ name: 'is_active', nullable: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ name: 'is_email_verified', nullable: true })
  isEmailVerified: boolean;

  @Expose()
  @ApiProperty({ type: PrivateProfileRoleData, nullable: true })
  role: PrivateProfileRoleData;

  @Expose()
  @ApiProperty({ format: 'date', nullable: true })
  birthday: Date;
}

class PublicProfileData extends BaseResponseDto {
  @Expose()
  @ApiProperty({ name: 'first_name', nullable: true })
  firstName: string;

  @Expose()
  @ApiProperty({ name: 'last_name', nullable: true })
  lastName: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @ToStorageUrl()
  avatar: string;

  @Expose()
  @ApiProperty({ type: PublicProfileRoleData, nullable: true })
  role: PublicProfileRoleData;

  @Expose()
  @ApiProperty({ format: 'date', nullable: true })
  birthday: Date;
}

class PrivateProfileResponseDto extends createDataResponse(PrivateProfileData, ProfileMessage.PROFILE_GET) {}
class PublicProfileResponseDto extends createDataResponse(PublicProfileData, ProfileMessage.PROFILE_GET) {}
class UpdateProfileResponseDto extends createBaseResponse(ProfileMessage.PROFILE_UPDATED) {}

class NotFoundProfileResponseDto extends createErrorResponse(ProfileMessage.NOT_FOUND, HttpStatus.NOT_FOUND) {}
class ProfileEmailExistResponseDto extends createErrorResponse(ProfileMessage.EMAIL_EXIST, HttpStatus.CONFLICT) {}

export {
  PrivateProfileResponseDto,
  PublicProfileResponseDto,
  UpdateProfileResponseDto,
  NotFoundProfileResponseDto,
  ProfileEmailExistResponseDto,
};
