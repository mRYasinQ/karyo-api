import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import QUEUES from '@/shared/constants/queues';

import StorageConsumer from './providers/storage.consumer';
import StorageService from './providers/storage.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.STORAGE,
    }),
  ],
  providers: [StorageService, StorageConsumer],
  exports: [StorageService],
})
class StorageModule {}

export default StorageModule;
