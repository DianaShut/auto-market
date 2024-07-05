import { Role } from '../../../../common/enums/role.enum';

export class UserResDto {
  name?: string;

  email: string;

  roles?: Role;

  deviceId: string;

  password: string;

  account?: boolean;

  image?: string;
}
