import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';
import { Logger } from 'nestjs-pino';

import { MailerService } from '@nestjs-modules/mailer';

import QUEUES from '@/shared/constants/queues';

import type { MailData, MailProcessResult } from '../interfaces/mail.interface';

@Processor(QUEUES.MAIL)
class MailConsumer extends WorkerHost {
  constructor(
    private readonly mailService: MailerService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<MailData>): Promise<MailProcessResult> {
    const { mail, title, message } = job.data;

    try {
      await this.mailService.sendMail({
        to: mail,
        subject: title,
        text: message,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Processing job ${job.id} for ${job.data.mail}, failed to send email.`);
      throw error;
    }
  }
}

export default MailConsumer;
