import { Module } from '@nestjs/common';

import RoleModule from '../role/role.module';
import UserModule from '../user/user.module';
import SuperuserCommand from './providers/superuser.command';
import SuperuserQuestions from './questions/superuser.questions';

@Module({
  imports: [UserModule, RoleModule],
  providers: [SuperuserCommand, SuperuserQuestions],
})
class CommandModule {}

export default CommandModule;
