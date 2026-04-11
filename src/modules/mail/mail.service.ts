import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import type { SendMailOptions } from './interfaces/mail.interface';

@Injectable()
class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async sendMail(options: SendMailOptions) {
    const { jobName = 'send_mail', ...data } = options;

    await this.mailQueue.add(jobName, data);
  }
}

export default MailService;
