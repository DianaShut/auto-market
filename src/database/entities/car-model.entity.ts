import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';
import { CarBrandEntity } from './car-brand.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseEntity } from './models/base.entity';

@Entity(TableNameEnum.MODELS)
export class CarModelEntity extends BaseEntity {
  @Column('text', { unique: true })
  model: string;

  @OneToMany(() => AdvertisementEntity, (entity) => entity.brand)
  advertisements?: AdvertisementEntity[];

  @Column()
  brand_id: string;
  @ManyToOne(() => CarBrandEntity, (entity) => entity.model)
  @JoinColumn({ name: 'brand_id' })
  brand?: CarBrandEntity;
}
