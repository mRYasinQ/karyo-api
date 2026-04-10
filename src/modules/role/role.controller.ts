import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
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
    permissions: ['SHOW_ROLE'],
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
    permissions: ['SHOW_ROLE'],
  })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async getRole(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleService.findOneById(id);
    if (!role) throw new NotFoundException(RoleMessage.NOT_FOUND);

    return role;
  }

  @Post()
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: RoleMessage.ROLE_CREATED,
    summary: 'Create role',
    type: CreateRoleResponseDto,
    permissions: ['CREATE_ROLE'],
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
    permissions: ['UPDATE_ROLE'],
  })
  @ApiConflictResponse({ type: ExistResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateRoleDto) {
    return this.roleService.update(id, body);
  }

  @Delete('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: RoleMessage.ROLE_DELETED,
    summary: 'Delete role',
    type: DeleteRoleResponseDto,
    permissions: ['DELETE_ROLE'],
  })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }
}

export default RoleController;
