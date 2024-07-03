import { Column, Entity, OneToMany } from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';
import { CarModelEntity } from './car-model.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseEntity } from './models/base.entity';

@Entity(TableNameEnum.BRANDS)
export class CarBrandEntity extends BaseEntity {
  @Column('text', { unique: true })
  brand: string;

  @OneToMany(() => AdvertisementEntity, (entity) => entity.brand)
  advertisements?: AdvertisementEntity[];

  @OneToMany(() => CarModelEntity, (entity) => entity.brand)
  model?: CarModelEntity[];
}
