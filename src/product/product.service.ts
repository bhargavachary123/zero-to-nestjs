import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new Product(); //creating a product object to initialize its values
    newProduct.name = createProductDto.name;
    newProduct.description = createProductDto.description;
    newProduct.price = createProductDto.price;
    return await this.productRepo.save(newProduct); // saving the new product in product table
    //or you can use "insert" in place of save
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find(); //returning all the products
  }

  async findOne(id: string): Promise<Product> {
    return this.productRepo.findOneBy({ product_id: id }) //returning a specific product
  }

  async update(updateProductDto: UpdateProductDto): Promise<string> {
    await this.productRepo.update(updateProductDto.id, updateProductDto); // updating the product
    return "Product updated sucessfullly";
  }

  async remove(id: string): Promise<string> {
    this.productRepo.delete({ product_id: id }); //deleting the product
    return "Product deleted successfully";
  }
}