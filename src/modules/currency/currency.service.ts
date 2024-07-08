import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CurrencyService {
  private exchangeRates: Record<string, number> = {};
  private lastUpdated: Date = new Date();

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.updateExchangeRates();
  }

  @Cron('0 0 * * *')
  public async updateExchangeRates(): Promise<void> {
    const response = await firstValueFrom(
      this.httpService.get(
        'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      ),
    );
    if (response.status === 200) {
      const rates = response.data;
      this.exchangeRates = rates.reduce((acc, rate) => {
        acc[rate.ccy] = parseFloat(rate.sale);
        return acc;
      }, {});
      this.lastUpdated = new Date();
      this.logger.log('Exchange rates updated');
    } else {
      this.logger.error('Failed to update exchange rates');
    }
  }

  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }
    const fromRate = this.exchangeRates[fromCurrency];
    const toRate = this.exchangeRates[toCurrency];
    if (!fromRate || !toRate) {
      throw new Error('Invalid currency');
    }
    const uahAmount = amount * fromRate;
    return uahAmount / toRate;
  }

  getExchangeRate(currency: string): number {
    return this.exchangeRates[currency];
  }

  getLastUpdated(): Date {
    return this.lastUpdated;
  }
}
