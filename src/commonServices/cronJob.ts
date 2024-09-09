import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronJobs {
  constructor() {}

  @Cron('* * * * * *')
  async handleCron() {
    try {
    } catch (error) {}
  }

  // call third party API and get exchange rates from exchange rates service
  @Cron(CronExpression.EVERY_10_HOURS)
  async fetchLatestExchangeRates() {
    try {
    } catch (error) {}
  }
}
