import { Controller, Get, Param, Delete, Post, Body, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ParseUUIDPipe } from 'src/config/custom/parse-uuid.pipe';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/user/entities/user.entity';

@Controller('order')
// @UsePipes(new ValidationPipe())  // Apply ValidationPipe at the controller level to validate all incoming requests.
export class OrderController {
  constructor(private readonly orderService: OrderService) { }
  @Post()
  /**
   * Note: If global validation is not enabled, uncomment the @UsePipes decorator to apply the ValidationPipe locally to validate the incoming DTO.
  */
 // @UsePipes(new ValidationPipe())
  @Roles(RoleEnum.CONSUMER) // Restrict access to only users with the CONSUMER role.
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Put()
  /**
    * Note: If global validation is not enabled, uncomment the @UsePipes decorator to apply the ValidationPipe locally to validate the incoming DTO.
  */
  // @UsePipes(new ValidationPipe())
  async update(@Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(updateOrderDto);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.remove(id);
  }
}