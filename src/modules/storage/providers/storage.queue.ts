import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import type { DeleteBucketOptions } from '../interfaces/storage.interface';

@Injectable()
class StorageQueue {
  constructor(@InjectQueue('storage') private readonly storageQueue: Queue) {}

  async deleteFile(options: DeleteBucketOptions) {
    const { jobName = 'delete_file', ...data } = options;

    await this.storageQueue.add(jobName, data);
  }
}

export default StorageQueue;
