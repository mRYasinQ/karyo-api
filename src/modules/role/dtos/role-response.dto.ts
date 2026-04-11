import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { type Permission, PERMISSION_LIST } from '@/shared/constants/permission';
import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import RoleMessage from '../role.message';

class RoleData {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ name: 'created_at', format: 'date-time' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ name: 'updated_at', format: 'date-time' })
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ enum: PERMISSION_LIST, isArray: true })
  permissions: Permission[];
}

class GetRolesResponseDto extends createPaginatedResponse(RoleData, RoleMessage.ROLES_GET) {}
class GetRoleResponseDto extends createDataResponse(RoleData, RoleMessage.ROLE_GET) {}
class CreateRoleResponseDto extends createBaseResponse(RoleMessage.ROLE_CREATED, HttpStatus.CREATED) {}
class UpdateRoleResponseDto extends createBaseResponse(RoleMessage.ROLE_UPDATED) {}
class DeleteRoleResponseDto extends createBaseResponse(RoleMessage.ROLE_DELETED) {}

class NotFoundRoleResponseDto extends createErrorResponse(RoleMessage.NOT_FOUND, HttpStatus.NOT_FOUND) {}
class ExistRoleResponseDto extends createErrorResponse(RoleMessage.ROLE_EXIST, HttpStatus.CONFLICT) {}

export {
  GetRolesResponseDto,
  GetRoleResponseDto,
  CreateRoleResponseDto,
  UpdateRoleResponseDto,
  DeleteRoleResponseDto,
  NotFoundRoleResponseDto,
  ExistRoleResponseDto,
};
