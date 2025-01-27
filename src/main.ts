import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
// import { CustomLogger } from './config/custom.logger';
import { WinstonLogger } from './config/winston.logger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

dotenv.config({ path: process.cwd() + '/.env' });
// the cmd method will return the current working directory of the Node.js process.
// .env.development is a file which i am using for storing environmental variables.
// if you are using normal .env file, the above import and config steps are not required.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())

  // apply global validation to entire application
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);

  // using logger with context
  // const logger = new Logger("Bootstrap");
  // logger.debug(`This application is runnning on: ${await app.getUrl()}`)

  // using custom logger 
  // const customlogger = new CustomLogger('Bootstrap') // the string indicates the logLocation
  // customlogger.error(`Application is running on: ${await app.getUrl()}`);

  // using winston logger
  const logger = new WinstonLogger();
  const appUrl = await app.getUrl();
  logger.info(`Application is running on: ${appUrl}`);
}
bootstrap();