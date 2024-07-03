import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseEntity } from './models/base.entity';

@Entity(TableNameEnum.PHOTO)
export class PhotoEntity extends BaseEntity {
  @Column({ type: 'text' })
  photoUrl: string;

  @Column()
  advertisement_id: string;
  @ManyToOne(() => AdvertisementEntity, (entity) => entity.photo)
  @JoinColumn({ name: 'advertisement_id' })
  advertisement?: AdvertisementEntity;
}
