import { Module } from '@nestjs/common';

import { CarModelController } from './carModel.controller';
import { CarModelService } from './services/carModel.service';

@Module({
  controllers: [CarModelController],
  providers: [CarModelService],
})
export class CarModelModule {}
