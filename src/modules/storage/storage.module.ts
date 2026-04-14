import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import QUEUES from '@/shared/constants/queues';

import StorageConsumer from './providers/storage.consumer';
import StorageProducer from './providers/storage.producer';
import StorageService from './providers/storage.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.STORAGE,
    }),
  ],
  providers: [StorageService, StorageConsumer, StorageProducer],
  exports: [StorageService, StorageProducer],
})
class StorageModule {}

export default StorageModule;
