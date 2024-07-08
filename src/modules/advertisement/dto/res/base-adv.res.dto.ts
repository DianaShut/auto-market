import { CarBrandEntity } from '../../../../database/entities/car-brand.entity';
import { CarModelEntity } from '../../../../database/entities/car-model.entity';
import { StatusEnum } from '../../../../database/entities/enums/adv-status.enum';
import { CurrencyEnum } from '../../../../database/entities/enums/currency-type.enum';
import { BaseUserResDto } from '../../../user/dto/res/base-user.res.dto';

export class BaseAdvertisementResDto {
  id: string;
  brand: CarBrandEntity;
  model: CarModelEntity;
  price: number;
  currency: CurrencyEnum;
  description: string;
  created: Date;
  updated: Date;
  isValidate: StatusEnum;

  user?: BaseUserResDto | null;
}
