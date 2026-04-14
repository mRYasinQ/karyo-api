import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import StorageProcessor from './providers/storage.processor';
import StorageQueue from './providers/storage.queue';
import StorageService from './providers/storage.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'storage',
    }),
  ],
  providers: [StorageService, StorageProcessor, StorageQueue],
  exports: [StorageService, StorageQueue],
})
class StorageModule {}

export default StorageModule;
