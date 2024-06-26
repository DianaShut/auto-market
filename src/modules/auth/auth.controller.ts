import { Controller } from '@nestjs/common';

import { AuthService } from './services/auth.service';

@Controller('user')
export class AuthController {
  constructor(private readonly userService: AuthService) {}
}
