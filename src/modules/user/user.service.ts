import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, wrap } from '@mikro-orm/postgresql';

import { generateRandomString } from '@/shared/utils/random';

import type { FindOneMethod } from '@/shared/types/service';

import PasswordProvider from '../common/providers/password.provider';
import type { CreateUser, UpdateUser } from './interfaces/user.interface';
import UserEntity from './user.entity';
import UserMessage from './user.message';
import UserRepository from './user.repository';

@Injectable()
class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly passwordProvider: PasswordProvider,
  ) {}

  findOneById: FindOneMethod<UserEntity, number> = (id, options?) => {
    return this.userRepo.findOne({ id }, options);
  };

  findOneByEmail: FindOneMethod<UserEntity, string> = (email, options?) => {
    return this.userRepo.findOne({ email }, options);
  };

  findOneByUsername: FindOneMethod<UserEntity, string> = (username, options?) => {
    return this.userRepo.findOne({ username }, options);
  };

  async create(data: CreateUser) {
    const { email, username, password } = data;

    const checkExistTask: Promise<boolean>[] = [
      this.checkUserExistByEmail(email),
      username ? this.checkUserExistByUsername(username) : Promise.resolve(false),
    ];
    const [isExistEmail, isExistUsername] = await Promise.all(checkExistTask);

    if (isExistEmail) throw new ConflictException(UserMessage.EMAIL_EXIST);
    if (isExistUsername) throw new ConflictException(UserMessage.USERNAME_EXIST);

    const newUsername = username ?? this.generateUsername();
    const hashedPassword = await this.passwordProvider.hash(password);

    const newUserData = { ...data, username: newUsername, password: hashedPassword };

    const newUser = this.userRepo.create(newUserData);
    await this.em.flush();

    return newUser;
  }

  async update(id: number, data: UpdateUser) {
    const user = await this.findOneById(id, { fields: ['id', 'email', 'username'] });
    if (!user) throw new NotFoundException(UserMessage.NOT_FOUND);

    const { email, username, isEmailVerified, password } = data;
    const newUserData = { ...data };

    const checkEmailCondition = email && user.email !== email;
    const checkUsernameCondition = username && user.username !== username;

    const [isExistEmail, isExistUsername] = await Promise.all([
      checkEmailCondition ? this.checkUserExistByEmail(email) : Promise.resolve(false),
      checkUsernameCondition ? this.checkUserExistByUsername(username) : Promise.resolve(false),
    ]);

    if (isExistEmail) throw new ConflictException(UserMessage.EMAIL_EXIST);
    if (isExistUsername) throw new ConflictException(UserMessage.USERNAME_EXIST);

    if (checkEmailCondition && isEmailVerified === undefined) newUserData.isEmailVerified = false;

    if (password) newUserData.password = await this.passwordProvider.hash(password);

    wrap(user).assign(newUserData);
    await this.em.flush();

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
