import { Global, Module } from '@nestjs/common';

import PasswordProvider from './providers/password.provider';

@Global()
@Module({
  providers: [PasswordProvider],
  exports: [PasswordProvider],
})
class CommonModule {}

export default CommonModule;
