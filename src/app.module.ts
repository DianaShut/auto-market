import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './common/exepcions/global-exepcion.filter';
import configuration from './configs/config';
import { AdvertisementModule } from './modules/advertisement/advertisement.module';
import { AuthModule } from './modules/auth/auth.module';
import { AWSModule } from './modules/aws/aws.module';
import { BrandModule } from './modules/brand/brand.module';
import { CarModelModule } from './modules/carModel/carModel.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { RedisModule } from './modules/redis/redis.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    AdvertisementModule,
    PostgresModule,
    LoggerModule,
    RepositoryModule,
    AWSModule,
    RedisModule,
    CurrencyModule,
    BrandModule,
    CarModelModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
