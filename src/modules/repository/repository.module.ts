import { Module } from '@nestjs/common';

import { AdvertisementRepository } from './services/advertisement.repository';
import { CarBrandRepository } from './services/carBrand.repository';
import { CarModelRepository } from './services/carModel.repository';
import { CurrencyRepository } from './services/currency.repository';
import { PhotoRepository } from './services/photo.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';
import { ViewRepository } from './services/view.repository';

@Module({
  controllers: [],
  providers: [
    AdvertisementRepository,
    CarBrandRepository,
    CarModelRepository,
    CurrencyRepository,
    PhotoRepository,
    RefreshTokenRepository,
    UserRepository,
    ViewRepository,
  ],
})
export class RepositoryModule {}
