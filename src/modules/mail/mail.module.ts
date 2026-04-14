import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import QUEUES from '@/shared/constants/queues';

import MailConsumer from './providers/mail.consumer';
import MailService from './providers/mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.MAIL,
    }),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService],
})
class MailModule {}

export default MailModule;
