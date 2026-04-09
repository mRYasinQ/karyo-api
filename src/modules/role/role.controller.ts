import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiConflictResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import ApiStandard from '@/shared/decorators/api-standard.decorator';

import { CreateRoleDto, GetRolesQueryDto, UpdateRoleDto } from './dtos/role.dto';
import {
  CreateRoleResponseDto,
  DeleteRoleResponseDto,
  ExistResponseDto,
  GetRoleResponseDto,
  GetRolesResponseDto,
  NotFoundResponseDto,
  UpdateRoleResponseDto,
} from './dtos/role-response.dto';
import RoleMessage from './role.message';
import RoleService from './role.service';

@Controller('role')
class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: RoleMessage.ROLES_GET,
    summary: 'Get roles',
    type: GetRolesResponseDto,
    secure: 'required',
  })
  getRoles(@Query() query: GetRolesQueryDto) {
    return this.roleService.findAll(query);
  }

  @Get('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: RoleMessage.ROLE_GET,
    summary: 'Get role',
    type: GetRoleResponseDto,
    secure: 'required',
  })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async getRole(@Param('id') id: string) {
    const role = await this.roleService.findOneById(parseInt(id));
    if (!role) throw new NotFoundException(RoleMessage.NOT_FOUND);

    return role;
  }

  @Post()
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: RoleMessage.ROLE_CREATED,
    summary: 'Create role',
    type: CreateRoleResponseDto,
    secure: 'required',
  })
  @ApiConflictResponse({ type: ExistResponseDto })
  creteRole(@Body() body: CreateRoleDto) {
    return this.roleService.create(body);
  }

  @Patch('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: RoleMessage.ROLE_UPDATED,
    summary: 'Update role',
    type: UpdateRoleResponseDto,
    secure: 'required',
  })
  @ApiConflictResponse({ type: ExistResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  updateRole(@Param('id') id: string, @Body() body: UpdateRoleDto) {
    return this.roleService.update(parseInt(id), body);
  }

  @Delete('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: RoleMessage.ROLE_DELETED,
    summary: 'Delete role',
    type: DeleteRoleResponseDto,
    secure: 'required',
  })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  deleteRole(@Param('id') id: string) {
    return this.roleService.delete(parseInt(id));
  }
}

export default RoleController;
