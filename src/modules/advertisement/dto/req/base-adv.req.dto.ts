import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

import { CarBrandEntity } from '../../../../database/entities/car-brand.entity';
import { StatusEnum } from '../../../../database/entities/enums/adv-status.enum';
import { CurrencyEnum } from '../../../../database/entities/enums/currency-type.enum';
import { RegionEnum } from '../../../../database/entities/enums/region.enum';

export class BaseAdvertisementReqDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  brand: CarBrandEntity;

  model: CarBrandEntity;

  @IsString()
  description: string;

  @IsInt()
  year: number;

  @IsEnum(RegionEnum)
  region: RegionEnum;

  @IsInt()
  price: number;

  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

  @IsNumber()
  priceFunc: number;

  @IsEnum(StatusEnum)
  isValidate: StatusEnum;

  @IsString()
  created: string;

  @IsString()
  updated: string;
}
