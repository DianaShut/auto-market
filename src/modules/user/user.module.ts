import { Module } from '@nestjs/common';

import { AwsService } from '../aws/aws.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, AwsService],
  exports: [UserService],
})
export class UserModule {}
