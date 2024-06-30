import { Column, Entity } from 'typeorm';

import { Role } from '../../common/enums/role.enum';
import { EAccountType } from './enums/account-type.enum';
import { BaseModel } from './models/base.model';

@Entity('users')
export class UserEntity extends BaseModel {
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

  // @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  // refreshTokens?: RefreshTokenEntity[];
  //
  // @OneToMany(() => AdvertisementEntity, (entity) => entity.user)
  // advertisement?: AdvertisementEntity[];
}
