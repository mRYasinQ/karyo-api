import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import QUEUES from '@/shared/constants/queues';

import type { MailData } from '../interfaces/mail.interface';
import { MAIL_JOBS } from '../mail.constant';

@Injectable()
class MailService {
  constructor(@InjectQueue(QUEUES.MAIL) private readonly mailQueue: Queue) {}

  sendMail(data: MailData) {
    return this.mailQueue.add(MAIL_JOBS.SEND_MAIL, data);
  }
}

export default MailService;
