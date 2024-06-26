import { Module } from '@nestjs/common';

import { RepositoryController } from './repository.controller';
import { RepositoryService } from './services/repository.service';

@Module({
  controllers: [RepositoryController],
  providers: [RepositoryService],
})
export class RepositoryModule {}
