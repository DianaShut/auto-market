import { AdvertisementResDto } from './adv.res.dto';

export class AdvertisementListResDto {
  data: AdvertisementResDto[];
  meta: {
    limit: number;
    offset: number;
    total: number;
  };
}
