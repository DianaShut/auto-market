import { PickType } from '@nestjs/swagger';

import { BaseAdvertisementReqDto } from './base-adv.req.dto';

export class UpdateAdvertisementReqDto extends PickType(
  BaseAdvertisementReqDto,
  ['brand', 'model', 'price', 'currency', 'description'],
) {}
