import { Module } from '@nestjs/common';

import StorageModule from '../storage/storage.module';
import UserModule from '../user/user.module';
import ProfileController from './profile.controller';

@Module({
  imports: [UserModule, StorageModule],
  controllers: [ProfileController],
})
class ProfileModule {}

export default ProfileModule;
