import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    @InjectQueue('order') // 👈 Inject queue
    private readonly orderQueue: Queue,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<string> {
    // Fetch the user to associat with the order
    const user = await this.userService.findOne(createOrderDto.userId);
    if (!user) {
      return 'User not found';
    }

    const order = new Order();  // Create a new order instance
    order.user = user;
    let total: number = 0;
    // Fetch and process each product
    const products = await Promise.all(createOrderDto.productIds.map(async (productId) => {
      const product = await this.productService.findOne(productId);
      if (product) {
        // Accumulate total price
        total += parseInt(product.price + "");
        return product;
      }
    }));
    order.products = products;   // set products to order
    order.total = total;
    order.ordered_on = new Date();
    await this.orderRepo.save(order); // Save the new order to the repository

    // override global attempts for this specific job
    await this.orderQueue.add(
      'send-confirmation',
      {
        orderId: order.order_id,
        userEmail: user.email,
      },
      {
        attempts: 2, // override global attempts
        priority: 4 // 1 (highest) to 10 (lowest)
      }
    );

    // advanced retry with backoff
    await this.orderQueue.add(
      'update-inventory',
      { productIds: createOrderDto.productIds },
      { attempts: 5, 
        backoff: { type: 'fixed', delay: 10000 }  // fixed 10s delay for retries
      }
    );

    return 'Ordered successfully (processing in background)';
  }

  async update(updateOrderDto: UpdateOrderDto): Promise<string> {
    const order = await this.orderRepo.findOne({ where: { order_id: updateOrderDto.orderId }, relations: { products: true } })
    if (!order) return "Order not exists!"

    let total: number = 0;
    const new_products = await Promise.all(updateOrderDto.productIds.map(async (productId) => {
      const product = await this.productService.findOne(productId);
      if (product) {
        // Accumulate total price
        total += parseInt(product.price + "");
        return product;
      }
    }));

    order.products = new_products;
    order.total = total
    await this.orderRepo.save(order)

    await this.orderQueue.add('update-inventory', {
      productIds: updateOrderDto.productIds,
    });

    return 'Order placed successfully! (processing in background)';
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepo.find({ relations: { products: true }, select: { products: { product_id: true } } });
  }

  async findOne(id: string): Promise<Order> {
    return await this.orderRepo.findOne({
      where: { order_id: id },
      select: { user: { user_id: true, name: true, profile: { profile_id: true, address: true } } }
    });
  }

  async remove(id: string): Promise<string> {
    await this.orderRepo.softDelete(id)
    return "Order deleted succesfully";
  }
}