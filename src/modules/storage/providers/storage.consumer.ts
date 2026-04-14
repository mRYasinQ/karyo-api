import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';
import { Logger } from 'nestjs-pino';

import QUEUES from '@/shared/constants/queues';

import type { StorageData, StorageProcessorResult } from '../interfaces/storage.interface';
import StorageService from './storage.service';

@Processor(QUEUES.STORAGE)
class StorageConsumer extends WorkerHost {
  constructor(
    private readonly storageService: StorageService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<StorageData>): Promise<StorageProcessorResult> {
    const { fileKey } = job.data;

    try {
      await this.storageService.deleteFile(fileKey);

      return { success: true };
    } catch (error) {
      this.logger.error(`Processing job ${job.id} for ${job.data.fileKey}, failed to delete bucket.`);
      throw error;
    }
  }
}

export default StorageConsumer;
