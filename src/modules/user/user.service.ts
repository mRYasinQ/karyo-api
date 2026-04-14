import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import type { EntityData, FilterQuery, RequiredEntityData } from '@mikro-orm/postgresql';
import { EntityManager, wrap } from '@mikro-orm/postgresql';

import { toCamelCase } from '@/shared/utils/case-transformer';
import { getPaginationOptions, paginate } from '@/shared/utils/pagination';
import { generateRandomString } from '@/shared/utils/random';

import type { FindOneMethod } from '@/shared/types/service';

import PasswordProvider from '../common/providers/password.provider';
import RoleEntity from '../role/role.entity';
import RoleService from '../role/role.service';
import StorageQueue from '../storage/providers/storage.queue';
import type { CreateUser, GetUsersQuery, UpdateUser } from './dtos/user.dto';
import UserEntity from './user.entity';
import UserMessage from './user.message';
import UserRepository from './user.repository';

@Injectable()
class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly passwordProvider: PasswordProvider,
    private readonly roleService: RoleService,
    private readonly storageQueue: StorageQueue,
  ) {}

  async findAll(query: GetUsersQuery) {
    const { search, role_id, is_active, is_email_verified, ...paginationQuery } = query;
    const { page, ...findOptions } = getPaginationOptions({ query: paginationQuery });

    const where: FilterQuery<UserEntity> = {};

    if (search) {
      where.$or = [
        { firstName: { $ilike: `%${search}%` } },
        { lastName: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
        { username: { $ilike: `%${search}%` } },
      ];
    }
    if (role_id) where.role = role_id;
    if (is_active !== undefined) where.isActive = is_active;
    if (is_email_verified !== undefined) where.isEmailVerified = is_email_verified;

    const [data, total] = await this.userRepo.findAndCount(where, { ...findOptions, populate: ['role.*'] });

    console.log(data);

    return paginate(data, total, page, findOptions.limit);
  }

  findOneById: FindOneMethod<UserEntity, number> = (id, options?) => {
    return this.userRepo.findOne({ id }, options);
  };

  findOneByEmail: FindOneMethod<UserEntity, string> = (email, options?) => {
    return this.userRepo.findOne({ email }, options);
  };

  findOneByUsername: FindOneMethod<UserEntity, string> = (username, options?) => {
    return this.userRepo.findOne({ username }, options);
  };

  async create(data: CreateUser, avatar?: string) {
    const { email, username, password, role_id } = data;

    const checkExistTask: Promise<boolean>[] = [
      this.checkUserExistByEmail(email),
      username ? this.checkUserExistByUsername(username) : Promise.resolve(false),
      role_id ? this.roleService.checkRoleExistById(role_id) : Promise.resolve(false),
    ];
    const [isExistEmail, isExistUsername, isExistRole] = await Promise.all(checkExistTask);

    if (isExistEmail) throw new ConflictException(UserMessage.EMAIL_EXIST);
    if (isExistUsername) throw new ConflictException(UserMessage.USERNAME_EXIST);
    if (role_id && !isExistRole) throw new NotFoundException(UserMessage.ROLE_NOT_FOUND);

    const newUsername = username ?? this.generateUsername();
    const hashedPassword = await this.passwordProvider.hash(password);
    const role = role_id && isExistRole ? this.em.getReference(RoleEntity, role_id) : undefined;

    const newUserData = toCamelCase<RequiredEntityData<UserEntity>>(data);
    const newUser = this.userRepo.create({ ...newUserData, username: newUsername, password: hashedPassword, role, avatar });
    await this.em.flush();

    return newUser;
  }

  async update(id: number, data: UpdateUser, avatar?: string) {
    const user = await this.findOneById(id, { fields: ['id', 'email', 'username', 'avatar', 'role.id'] });
    if (!user) throw new NotFoundException(UserMessage.NOT_FOUND);

    const { role_id } = data;
    const newUserData = toCamelCase<EntityData<UserEntity>>(data);
    const { email, username, password, isEmailVerified } = newUserData;

    const checkEmailCondition = email && user.email !== email;
    const checkUsernameCondition = username && user.username !== username;
    const checkRoleCondition = role_id && user.role?.id !== role_id;

    const [isExistEmail, isExistUsername, isExistRole] = await Promise.all([
      checkEmailCondition ? this.checkUserExistByEmail(email) : Promise.resolve(false),
      checkUsernameCondition ? this.checkUserExistByUsername(username) : Promise.resolve(false),
      checkRoleCondition ? this.roleService.checkRoleExistById(role_id) : Promise.resolve(false),
    ]);

    if (isExistEmail) throw new ConflictException(UserMessage.EMAIL_EXIST);
    if (isExistUsername) throw new ConflictException(UserMessage.USERNAME_EXIST);
    if (checkRoleCondition && !isExistRole) throw new NotFoundException(UserMessage.ROLE_NOT_FOUND);

    if (checkEmailCondition && isEmailVerified === undefined) newUserData.isEmailVerified = false;
    if (checkRoleCondition && isExistRole) newUserData.role = this.em.getReference(RoleEntity, role_id);
    if (password) newUserData.password = await this.passwordProvider.hash(password);
    if (avatar) newUserData.avatar = avatar;

    wrap(user).assign(newUserData);
    await this.em.flush();

    const userAvatar = user.avatar;
    if (avatar && userAvatar) await this.storageQueue.deleteFile({ fileKey: userAvatar });

    return;
  }

  async delete(id: number) {
    const user = await this.findOneById(id, { fields: ['id', 'avatar'] });
    if (!user) throw new NotFoundException(UserMessage.NOT_FOUND);

    this.em.remove(user);
    await this.em.flush();

    const userAvatar = user.avatar;
    if (userAvatar) await this.storageQueue.deleteFile({ fileKey: userAvatar });

    return;
  }

  async checkUserExistById(id: number) {
    const user = await this.findOneById(id, { fields: ['id'] });
    return Boolean(user);
  }

  async checkUserExistByEmail(email: string) {
    const user = await this.findOneByEmail(email, { fields: ['id'] });
    return Boolean(user);
  }

  async checkUserExistByUsername(username: string) {
    const user = await this.findOneByUsername(username, { fields: ['id'] });
    return Boolean(user);
  }

  private generateUsername() {
    const prefix = 'u';
    const randomString = generateRandomString(8);
    const username = `${prefix}_${randomString}`;

    return username;
  }
}

export default UserService;
