import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import QUEUES from '@/shared/constants/queues';

import type { SendMailOptions } from '../interfaces/mail.interface';

@Injectable()
class MailService {
  constructor(@InjectQueue(QUEUES.MAIL) private readonly mailQueue: Queue) {}

  async sendMail(options: SendMailOptions) {
    const { jobName = 'send-mail', ...data } = options;

    await this.mailQueue.add(jobName, data);
  }
}

export default MailService;
