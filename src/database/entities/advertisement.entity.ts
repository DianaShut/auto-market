import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CarBrandEntity } from './car-brand.entity';
import { CarModelEntity } from './car-model.entity';
import { StatusEnum } from './enums/adv-status.enum';
import { CurrencyEnum } from './enums/currency-type.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseEntity } from './models/base.entity';
import { PhotoEntity } from './photo.entity';
import { RegionEntity } from './region.entity';
import { UserEntity } from './user.entity';
import { ViewEntity } from './views.entity';

@Entity(TableNameEnum.ADVERTISEMENTS)
export class AdvertisementEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  brand_Id: string;
  @ManyToOne(() => CarBrandEntity, (entity) => entity.advertisements)
  @JoinColumn({ name: 'brand_Id' })
  brand: CarBrandEntity;

  @Column()
  model_Id: string;
  @ManyToOne(() => CarModelEntity, (entity) => entity.advertisements)
  @JoinColumn({ name: 'model_Id' })
  model: CarModelEntity;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'numeric' })
  priceFunc?: number;

  @Column()
  region_Id: string;
  @ManyToOne(() => RegionEntity, (entity) => entity.advertisement)
  @JoinColumn({ name: 'region_Id' })
  region?: RegionEntity;

  @Column({ type: 'enum', enum: CurrencyEnum, default: CurrencyEnum.UAH })
  currency: CurrencyEnum;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.NOT_ACTIVE })
  isValidate: StatusEnum;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.advertisement)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => ViewEntity, (entity) => entity.advertisement)
  views?: ViewEntity[];

  @OneToMany(() => PhotoEntity, (entity) => entity.advertisement)
  photo?: PhotoEntity[];
}
