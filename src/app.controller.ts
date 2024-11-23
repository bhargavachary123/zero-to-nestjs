import { Controller, Get, Ip, Logger, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { WinstonLogger } from './config/winston.logger';

@Controller()
export class AppController {
  private readonly winstonlogger = new WinstonLogger();
  constructor(
    private readonly appService: AppService
  ) { }

  @Get()
  getHello(@Ip() Ip: string): string {
    this.winstonlogger.info(`GetHello call from Ip: ${Ip}`);
    return this.appService.getHello();
  }
}