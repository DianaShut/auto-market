import { Module } from '@nestjs/common';

import { LoggerService } from '../logger/logger.service';
import { CurrencyService } from './currency.service';

@Module({
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
