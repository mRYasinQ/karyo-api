import { Injectable } from '@nestjs/common';

import bcrypt from 'bcryptjs';

@Injectable()
class PasswordProvider {
  private readonly SALT = 10;

  async hash(password: string) {
    const hashedPasword = await bcrypt.hash(password, this.SALT);
    return hashedPasword;
  }

  async compare(password: string, hashedPassword: string) {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  }
}

export default PasswordProvider;
