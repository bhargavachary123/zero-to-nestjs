import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyConfigModule } from './config/config.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    MyConfigModule,
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
      //Logger setings to log error's and warn's in the ORM.
      logger: 'file',
      logging: ["error"]
    }),
    ProductModule,
    UserModule,
    OrderModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }