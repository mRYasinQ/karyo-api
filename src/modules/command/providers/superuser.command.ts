import { ConfigService } from '@nestjs/config';

import { EntityManager, RequestContext } from '@mikro-orm/postgresql';
import { Command, CommandRunner, InquirerService } from 'nest-commander';

import RoleService from '@/modules/role/role.service';

import { PERMISSION_LIST } from '@/shared/constants/permission';
import { EnvConfig } from '@/shared/schemas/env.schema';
import baseUserSchema from '@/shared/schemas/user.schema';

import UserService from '../../user/user.service';
import type { SuperuserData } from '../interfaces/superuser.interface';
import { SUPERUSER_QUESTION_KEY } from '../questions/superuser.questions';

@Command({
  name: 'create-superuser',
  description: 'Create user with all exist permissions',
})
class SuperuserCommand extends CommandRunner {
  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
    private readonly inquirerService: InquirerService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {
    super();
  }

  async run(_inputs: string[], _options?: Record<string, unknown>): Promise<void> {
    console.log('--- Karyo Superuser Creation ---');

    try {
      const answers = await this.inquirerService.ask<SuperuserData>(SUPERUSER_QUESTION_KEY, undefined);

      const validateAnswers = await baseUserSchema.safeParseAsync(answers);
      if (!validateAnswers.success) {
        console.error(validateAnswers.error.issues[0].message);
        process.exit(1);
      }

      console.log('Creating superuser...');

      const fork = this.em.fork();
      await RequestContext.create(fork, async () => {
        const roleId = await this.findOrCreateRole();
        await this.userService.create({ ...validateAnswers.data, is_email_verified: true, is_active: true, role_id: roleId });
      });

      console.log('Superuser created successfully!');
      process.exit(0);
    } catch {
      console.error(`Creation failed.`);
      process.exit(1);
    }
  }

  private async findOrCreateRole(): Promise<number> {
    const roleName = this.configService.getOrThrow<EnvConfig['DEFAULT_ROLE']>('app.default_role');

    const role = await this.roleService.findOneByName(roleName, { fields: ['id'] });
    if (role) return role.id;

    const newRole = await this.roleService.create({ name: roleName, permissions: PERMISSION_LIST });

    return newRole.id;
  }
}

export default SuperuserCommand;
