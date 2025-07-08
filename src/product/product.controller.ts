import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseUUIDPipe } from 'src/config/custom/parse-uuid.pipe';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/user/entities/user.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('product')
@UseInterceptors(CacheInterceptor)  // Apply to all routes in this controller
// @UsePipes(new ValidationPipe())  // Apply ValidationPipe at the controller level to validate all incoming requests.
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  /**
    * Note: If global validation is not enabled, uncomment the @UsePipes decorator to apply the ValidationPipe locally to validate the incoming DTO.
  */
  // @UsePipes(new ValidationPipe())
  @Roles(RoleEnum.CONSUMER) // Restrict access to only users with the CONSUMER role.
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  // @UseInterceptors(CacheInterceptor) // Apply CacheInterceptor to this route only
  // @CacheKey('product')  // optional
  // @CacheTTL(60 * 100) // custom milliseconds(optional)
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Put()
  /**
    * Note: If global validation is not enabled, uncomment the @UsePipes decorator to apply the ValidationPipe locally to validate the incoming DTO.
  */
  // @UsePipes(new ValidationPipe())
  async update(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}