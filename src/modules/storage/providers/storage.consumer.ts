import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';
import { Logger } from 'nestjs-pino';

import QUEUES from '@/shared/constants/queues';

import type { StorageProcessorResult } from '../interfaces/storage.interface';
import { STORAGE_JOBS } from '../storage.constant';
import StorageService from './storage.service';

@Processor(QUEUES.STORAGE)
class StorageConsumer extends WorkerHost {
  constructor(
    private readonly storageService: StorageService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<unknown, unknown, string>) {
    switch (job.name) {
      case STORAGE_JOBS.DELETE_FILE: {
        const fileKey = job.data as string;
        return this.deleteFile(fileKey, job.id);
      }
    }
  }

  private async deleteFile(fileKey: string, jobId: string = 'unknown-id'): Promise<StorageProcessorResult> {
    try {
      await this.storageService.executeS3Deletion(fileKey);

      return { success: true };
    } catch (error) {
      this.logger.error(`Processing job ${jobId} for ${fileKey}, failed to delete file.`);
      throw error;
    }
  }
}

export default StorageConsumer;
