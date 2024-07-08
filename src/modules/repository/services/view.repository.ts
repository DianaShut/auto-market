import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ViewEntity } from '../../../database/entities/views.entity';

@Injectable()
export class ViewRepository extends Repository<ViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ViewEntity, dataSource.manager);
  }
  public async findViewsByDay(advertisement_id: string): Promise<number> {
    const date = new Date();

    const qb = this.createQueryBuilder('views');
    qb.select('COUNT(*)', 'viewCount');
    qb.where('views.advertisement_id = :advertisement_id', {
      advertisement_id,
    });
    qb.andWhere('DATE(views.views) = :date', {
      date: date,
    });
    const result = await qb.getRawOne();
    return result.viewCount;
  }
  public async findViewsByWeek(advertisement_id: string): Promise<number> {
    const date = new Date();

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Set to first day of the week
    const endOfWeek = new Date(date);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to last day of the week
    const qb = this.createQueryBuilder('views');
    qb.select('COUNT(*)', 'viewCount');
    qb.where('views.advertisement_id = :advertisement_id', {
      advertisement_id,
    });
    qb.andWhere('views.views >= :startOfWeek AND views.views <= :endOfWeek', {
      startOfWeek: startOfWeek.toISOString().split('T')[0],
      endOfWeek: endOfWeek.toISOString().split('T')[0],
    });
    const result = await qb.getRawOne();
    return parseInt(result.viewCount);
  }

  public async findViewsByMonth(advertisement_id: string): Promise<number> {
    const date = new Date();

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const qb = this.createQueryBuilder('views');
    qb.select('COUNT(*)', 'viewCount');
    qb.where('views.advertisement_id = :advertisement_id', {
      advertisement_id,
    });
    qb.andWhere('views.views >= :startOfMonth AND views.views <= :endOfMonth', {
      startOfMonth: startOfMonth.toISOString().split('T')[0],
      endOfMonth: endOfMonth.toISOString().split('T')[0],
    });
    const result = await qb.getRawOne();
    return parseInt(result.viewCount);
  }
}
