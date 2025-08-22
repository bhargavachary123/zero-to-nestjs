import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from 'src/category/category.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly categoryService: CategoryService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(createProductDto.categoryId);
    if (!category) {
      return 'Category not found';
    }
    const newProduct = new Product(); // Creating a product object to initialize its values
    newProduct.name = createProductDto.name;
    newProduct.description = createProductDto.description;
    newProduct.price = createProductDto.price;
    newProduct.category = category;  // Directly assign the found category
    await this.productRepo.insert(newProduct); // insert the new product in the product table
    return "Product created successfully";
  }

  async findAll(): Promise<Product[]> {
    const value = await this.cacheManager.get<Product[]>('products');
    if (value) {
      console.log("Retrieved from cache");
      return value;
    }
    const products = await this.productRepo.find();
    await this.cacheManager.set('products', products); //without overriding defalt ttl
    // await this.cacheManager.set('products', products, 300000); // override defalt ttl
    return products;
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepo.findOneBy({ product_id: id }) //returning a specific product
  }

  async update(updateProductDto: UpdateProductDto) {
    const product = await this.findOne(updateProductDto.id);
    if (!product)
      return "Product no"
    await this.productRepo.update(updateProductDto.id, updateProductDto); // updating the product
    return "Product updated sucessfullly";
  }

  async remove(id: string): Promise<string> {
    await this.productRepo.softDelete({ product_id: id }); // Mark as Deleted the product if exists, Does not check if entity exist in the database.
    /* 
    the soft delete will not delete the object in table but it will make that object has been deleted by adding the date in deleted_on column. here we can retrive the value if needed.
                                  OR
    the delete will delete entire object from table and can't be retrived back
    */
    return "Product deleted successfully";
  }
}