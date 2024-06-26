import { Module } from '@nestjs/common';

import { AdvertisementController } from './advertisement.controller';
import { UserService } from './services/user.service';

@Module({
  controllers: [AdvertisementController],
  providers: [UserService],
})
export class AdvertisementModule {}
