import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyConfigModule } from './config/config.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MyConfigModule,
    ThrottlerModule.forRoot([
      {
        name: 'default', // If name is not provided, the name is given as default
        ttl: minutes(1), // Time window in minutes
        limit: 100, // Number of allowed requests in that window
      }
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql', // Specifying the database type as mysql and it also supports mariadb
      // Replace env config names as you defines in file.
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      synchronize: process.env.DB_SYNC == 'true',
      autoLoadEntities: true,
      // Logger settings to log errors and warnings in the ORM.
      logger: 'file',
      logging: ["error"]
    }),
    CacheModule.register({
      isGlobal: true, // Making the cache module global
      ttl: 5 * 60 * 1000, // Default cache time to live in milliseconds
    }),
    ProductModule,
    UserModule,
    OrderModule,
    CategoryModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }