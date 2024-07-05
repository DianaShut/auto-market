import { UserEntity } from '../../../database/entities/user.entity';
import { BaseUserResDto } from '../dto/res/base-user.res.dto';

export class UserMapper {
  public static toResponseDto(userEntity: UserEntity): BaseUserResDto {
    return {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      accountType: userEntity.accountType,
      roles: userEntity.roles,
      image: userEntity.image,
    };
  }
}
