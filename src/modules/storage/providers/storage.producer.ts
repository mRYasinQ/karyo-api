import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import QUEUES from '@/shared/constants/queues';

import type { DeleteBucketOptions } from '../interfaces/storage.interface';

@Injectable()
class StorageProducer {
  constructor(@InjectQueue(QUEUES.STORAGE) private readonly storageQueue: Queue) {}

  async deleteFile(options: DeleteBucketOptions) {
    const { jobName = 'delete-file', ...data } = options;

    await this.storageQueue.add(jobName, data);
  }
}

export default StorageProducer;
