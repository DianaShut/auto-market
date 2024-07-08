import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';

export interface AdvertisementWithPrices extends AdvertisementEntity {
  priceUAH: number;
  priceEUR: number;
  priceUSD: number;
}
