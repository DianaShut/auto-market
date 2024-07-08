import { PickType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';

import { CurrencyEnum } from '../../../../database/entities/enums/currency-type.enum';
import { BaseAdvertisementReqDto } from './base-adv.req.dto';

export class CreateAdvertisementReqDto extends PickType(
  BaseAdvertisementReqDto,
  ['brand', 'model', 'price', 'currency', 'title', 'year', 'region'],
) {
  @IsString()
  description: string;

  @IsInt()
  price: number;

  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;
}
