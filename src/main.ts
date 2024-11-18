import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Retrieving the application port from the configuration or using the default value of 3000
  const port = configService.get<number>('app.port', 3000); // Defaults to 3000 if not specified
  
  await app.listen(port);
  // Logging the application URL to confirm successful startup
  console.log(`This application is runnning on: ${await app.getUrl()}`)
}
bootstrap()