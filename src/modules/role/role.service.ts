import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, wrap } from '@mikro-orm/postgresql';

import type { FindOneMethod } from '@/shared/types/service';

import type { CreateRole, UpdateRole } from './dtos/role.dto';
import RoleEntity from './role.entity';
import RoleMessage from './role.message';
import RoleRepository from './role.repository';

@Injectable()
class RoleService {
  constructor(
    private readonly em: EntityManager,
    private readonly roleRepo: RoleRepository,
  ) {}

  findOneById: FindOneMethod<RoleEntity, number> = (id, options?) => {
    return this.roleRepo.findOne({ id }, options);
  };

  findOneByName: FindOneMethod<RoleEntity, string> = (name, options?) => {
    return this.roleRepo.findOne({ name }, options);
  };

  async create(data: CreateRole) {
    const { name } = data;

    const isRoleExist = await this.checkRoleExistByName(name);
    if (isRoleExist) throw new ConflictException(RoleMessage.ROLE_EXIST);

    const newRole = this.roleRepo.create(data);
    await this.em.flush();

    return newRole;
  }

  async update(id: number, data: UpdateRole) {
    const role = await this.findOneById(id);
    if (!role) throw new NotFoundException(RoleMessage.NOT_FOUND);

    const { name } = data;

    const checkNameCondition = name && role.name !== name;
    const isRoleExist = checkNameCondition ? await this.checkRoleExistByName(name) : false;
    if (isRoleExist) throw new ConflictException(RoleMessage.ROLE_EXIST);

    wrap(role).assign(data);
    await this.em.flush();

    return;
  }

  async delete(id: number) {
    const role = await this.findOneById(id, { fields: ['id'] });
    if (!role) throw new NotFoundException(RoleMessage.NOT_FOUND);

    await this.roleRepo.nativeDelete({ id });

    return;
  }

  async checkRoleExistByName(name: string) {
    const user = await this.findOneByName(name, { fields: ['id'] });
    return Boolean(user);
  }
}

export default RoleService;
