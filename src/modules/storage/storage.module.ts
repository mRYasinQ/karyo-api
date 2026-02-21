import { Module } from '@nestjs/common';

import StorageService from './storage.service';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
class StorageModule {}

export default StorageModule;
