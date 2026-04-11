import { ConfigService } from '@nestjs/config';

import type { MailerAsyncOptions } from 'node_modules/@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';

import type { EnvConfig } from '@/shared/schemas/env.schema';

const MailConfig: MailerAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    transport: {
      host: config.getOrThrow<EnvConfig['MAIL_HOST']>('mail.host'),
      port: config.getOrThrow<EnvConfig['MAIL_PORT']>('mail.port'),
      secure: config.getOrThrow<EnvConfig['MAIL_SECURE']>('mail.secure'),
      auth: {
        user: config.getOrThrow<EnvConfig['MAIL_USER']>('mail.username'),
        pass: config.getOrThrow<EnvConfig['MAIL_PASSWORD']>('mail.password'),
      },
    },
    defaults: {
      from: config.getOrThrow<EnvConfig['MAIL_FROM']>('mail.from'),
    },
  }),
};

export default MailConfig;
