import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const new_category = new Category();
    new_category.name = createCategoryDto.name;
    new_category.description = createCategoryDto.description;
    const category = await this.categoryRepo.save(new_category)
    return { message: "Category created succesfully", category_Id: category.category_id };
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepo.find();
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoryRepo.findOneBy({ category_id: id });
  }

  async update(updateCategoryDto: UpdateCategoryDto): Promise<string> {
    const category = await this.categoryRepo.findOneBy({ category_id: updateCategoryDto.id });
    if (!category) {
      return 'Category not found';
    }
    await this.categoryRepo.update(updateCategoryDto.id, updateCategoryDto)
    return 'Category updated succesfully';
  }

  async remove(id: string): Promise<string> {
    const category = await this.categoryRepo.findOneBy({ category_id: id });
    if (!category) {
      return 'Category not found';
    }
    await this.categoryRepo.softDelete({ category_id: id });
    return 'Category deleted succesfully';
  }
}