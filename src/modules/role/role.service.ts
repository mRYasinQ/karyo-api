import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, wrap } from '@mikro-orm/postgresql';

import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import type { CreateRole, GetRolesQuery, UpdateRole } from './dtos/role.dto';
import RoleEntity from './role.entity';
import RoleMessage from './role.message';
import RoleRepository from './role.repository';

@Injectable()
class RoleService {
  constructor(
    private readonly em: EntityManager,
    private readonly roleRepo: RoleRepository,
  ) {}

  async findAll(query: GetRolesQuery) {
    const { offset, orderBy, limit, page } = getPaginationOptions({ query });

    const [data, total] = await this.roleRepo.findAndCount({}, { limit, offset, orderBy });

    return paginate(data, total, page, limit);
  }

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
    const role = await this.findOneById(id, { fields: ['id', 'name'] });
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
    const role = await this.findOneByName(name, { fields: ['id'] });
    return Boolean(role);
  }
}

export default RoleService;
