import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import MailProcessor from './mail.processor';
import MailService from './mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
class MailModule {}

export default MailModule;
