import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';
import { Logger } from 'nestjs-pino';

import { MailerService } from '@nestjs-modules/mailer';

import QUEUES from '@/shared/constants/queues';

import type { MailData, MailProcessResult } from '../interfaces/mail.interface';
import { MAIL_JOBS } from '../mail.constant';

@Processor(QUEUES.MAIL)
class MailConsumer extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<unknown, unknown, string>) {
    switch (job.name) {
      case MAIL_JOBS.SEND_MAIL: {
        const data = job.data as MailData;
        return this.sendMail(data, job.id);
      }
    }
  }

  private async sendMail(data: MailData, jobId: string = 'unknown-id'): Promise<MailProcessResult> {
    const { mail, title, message, type = 'general' } = data;

    try {
      await this.mailerService.sendMail({
        to: mail,
        subject: title,
        text: message,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Processing job ${jobId} for ${mail} [Type: ${type}], failed to send email.`);
      throw error;
    }
  }
}

export default MailConsumer;
