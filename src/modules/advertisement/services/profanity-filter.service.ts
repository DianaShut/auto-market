import { Injectable } from '@nestjs/common';
import Filter from 'bad-words';

import { CreateAdvertisementReqDto } from '../dto/req/create-adv.req.dto';

@Injectable()
export class ProfanityFilterService {
  private filter: Filter;

  constructor() {
    this.filter = new Filter();
  }

  public checkProfanity(dto: CreateAdvertisementReqDto): boolean {
    return this.filter.isProfane(dto.description);
  }
}
