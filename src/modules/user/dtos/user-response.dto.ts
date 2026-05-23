import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { type Permission, PERMISSION_LIST } from '@/shared/constants/permission';
import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import UserMessage from '../user.message';

class UserAdminRoleData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ enum: PERMISSION_LIST, isArray: true })
  permissions: Permission[];
}

class UserAdminData extends BaseResponseDto {
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
  @ApiProperty({ name: 'is_active' })
  isActive: boolean;

  @Expose()
  @ApiProperty({ name: 'is_email_verified' })
  isEmailVerified: boolean;

  @Expose()
  @ApiProperty({ type: UserAdminRoleData, nullable: true })
  role: UserAdminRoleData;

  @Expose()
  @ApiProperty({ format: 'date', nullable: true })
  birthday: Date;
}

class GetUsersAdminResponseDto extends createPaginatedResponse(UserAdminData, UserMessage.USERS_GET) {}
class GetUserAdminResponseDto extends createDataResponse(UserAdminData, UserMessage.USER_GET) {}
class CreateUserAdminResponseDto extends createBaseResponse(UserMessage.USER_CREATED, HttpStatus.CREATED) {}
class UpdateUserAdminResponseDto extends createBaseResponse(UserMessage.USER_UPDATED) {}
class DeleteUserAdminResponseDto extends createBaseResponse(UserMessage.USER_DELETED) {}

class NotFoundUserResponseDto extends createErrorResponse(UserMessage.NOT_FOUND, HttpStatus.NOT_FOUND) {}
class NotFoundUserRoleResponseDto extends createErrorResponse(UserMessage.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND) {}
class EmailExistResponseDto extends createErrorResponse(UserMessage.EMAIL_EXIST, HttpStatus.CONFLICT) {}
class UsernameExistResponseDto extends createErrorResponse(UserMessage.USERNAME_EXIST, HttpStatus.CONFLICT) {}

export {
  GetUsersAdminResponseDto,
  GetUserAdminResponseDto,
  CreateUserAdminResponseDto,
  UpdateUserAdminResponseDto,
  DeleteUserAdminResponseDto,
  NotFoundUserResponseDto,
  NotFoundUserRoleResponseDto,
  EmailExistResponseDto,
  UsernameExistResponseDto,
};
