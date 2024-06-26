import { Controller } from '@nestjs/common';

import { RepositoryService } from './services/repository.service';

@Controller('user')
export class RepositoryController {
  constructor(private readonly userService: RepositoryService) {}
}
