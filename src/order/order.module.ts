import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ProductService } from 'src/product/product.service';
import { Profile } from 'src/user/entities/profile.entity';
import { Product } from 'src/product/entities/product.entity';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Profile, Product, Category])],
  controllers: [OrderController],
  providers: [OrderService, UserService, ProductService, CategoryService],
})
export class OrderModule { }
