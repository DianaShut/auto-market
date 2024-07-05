import { EAccountType } from '../../../../database/entities/enums/account-type.enum';

export class BaseUserResDto {
  id: string;

  name?: string;

  email: string;

  accountType?: EAccountType;

  roles: string;

  blocked?: boolean;

  image?: string;
}
