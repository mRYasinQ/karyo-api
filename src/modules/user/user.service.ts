import { BadRequestException, Injectable } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import { generateRandomString } from '@/shared/utils/random';

import PasswordProvider from '../common/providers/password.provider';
import type { CreateUser } from './interfaces/user.interface';
import UserRepository from './user.repository';

@Injectable()
class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly passwordProvider: PasswordProvider,
  ) {}

  async create(data: CreateUser) {
    const isUserExist = await this.checkUserExistByEmail(data.email);
    if (isUserExist) throw new BadRequestException();

    const hashedPassword = await this.passwordProvider.hash(data.password);

    const username = data.username ?? this.generateUsername();
    const newUserData = { ...data, username, password: hashedPassword };

    const newUser = this.userRepo.create(newUserData);
    await this.em.flush();

    return newUser;
  }

  async checkUserExistByEmail(email: string) {
    const user = await this.userRepo.findOne({ email }, { fields: ['id'] });
    return Boolean(user);
  }

  async checkUserExistByUsername(username: string) {
    const user = await this.userRepo.findOne({ username }, { fields: ['id'] });
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
