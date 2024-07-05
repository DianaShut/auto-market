import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ViewEntity } from '../../../database/entities/views.entity';

@Injectable()
export class ViewRepository extends Repository<ViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ViewEntity, dataSource.manager);
  }
}
