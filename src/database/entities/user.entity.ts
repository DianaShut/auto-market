import { Column, Entity, OneToMany } from 'typeorm';

import { Role } from '../../common/enums/role.enum';
import { AdvertisementEntity } from './advertisement.entity';
import { EAccountType } from './enums/account-type.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseEntity } from './models/base.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity(TableNameEnum.USERS)
export class UserEntity extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  deviceId: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  roles: Role;

  @Column({ type: 'enum', enum: EAccountType, default: EAccountType.FREE })
  accountType: EAccountType;

  @Column({ type: 'boolean', default: false })
  blocked: boolean;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => AdvertisementEntity, (entity) => entity.user)
  advertisement?: AdvertisementEntity[];
}
