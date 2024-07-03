import { Column, Entity, OneToMany } from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';
import { RegionEnum } from './enums/region.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseEntity } from './models/base.entity';

@Entity(TableNameEnum.REGIONS)
export class RegionEntity extends BaseEntity {
  @Column({ type: 'enum', enum: RegionEnum, default: RegionEnum.UNSPECIFIED })
  region: RegionEnum;

  @OneToMany(() => AdvertisementEntity, (entity) => entity.region)
  advertisement?: AdvertisementEntity[];
}
