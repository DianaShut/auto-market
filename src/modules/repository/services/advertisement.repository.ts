import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { AdvertisementListReqDto } from '../../advertisement/dto/req/adv-list.req.dto';
import { IUserData } from '../../auth/interfaces/user-data.interface';

@Injectable()
export class AdvertisementRepository extends Repository<AdvertisementEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdvertisementEntity, dataSource.manager);
  }

  public async findAll(
    query: AdvertisementListReqDto,
  ): Promise<[AdvertisementEntity[], number]> {
    const qb = this.createQueryBuilder('advertisement');
    qb.addOrderBy('advertisement.created', 'DESC');

    qb.leftJoinAndSelect('advertisement.user', 'user');
    qb.take(query.limit);
    qb.skip(query.offset);
    return await qb.getManyAndCount();
  }

  public async findAllMyAdvertisement(
    query: AdvertisementListReqDto,
    userData: IUserData,
  ): Promise<[AdvertisementEntity[], number]> {
    const qb = this.createQueryBuilder('advertisement');
    qb.andWhere('user_id=:my', { my: userData.userId });
    qb.leftJoinAndSelect('advertisement.user', 'user');
    qb.addOrderBy('advertisement.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);
    return await qb.getManyAndCount();
  }

  public async averagePrice(query: AdvertisementEntity): Promise<number> {
    const qb = this.createQueryBuilder('advertisement');
    qb.where('advertisement.brand = :brand', { brand: query.brand });
    qb.andWhere('advertisement.model = :model', { model: query.model });
    qb.select('AVG(advertisement.priceFunc)', 'averagePrice');
    const result = await qb.getRawOne();
    const averagePrice = result ? parseFloat(result.averagePrice) || 0 : 0;

    return averagePrice;
  }
}
