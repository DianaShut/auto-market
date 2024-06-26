import { Module } from '@nestjs/common';

import { AdvertisementModule } from './modules/advertisement/advertisement.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, AuthModule, AdvertisementModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
