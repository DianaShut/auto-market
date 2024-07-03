import { Column, Entity } from 'typeorm';

import { CurrencyEnum } from './enums/currency-type.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseEntity } from './models/base.entity';

@Entity(TableNameEnum.CURRENCY)
export class CurrencyEntity extends BaseEntity {
  @Column({ type: 'enum', enum: CurrencyEnum, default: CurrencyEnum.UAH })
  currency: CurrencyEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  buying: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  selling: number;
}
