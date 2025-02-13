import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ParseUUIDPipe } from 'src/config/custom/parse-uuid.pipe';
import { RoleEnum } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/role.decorator';

@Controller('category')
// @UsePipes(new ValidationPipe())  // Apply ValidationPipe at the controller level to validate all incoming requests.
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  /**
    * Note: If global validation is not enabled, uncomment the @UsePipes decorator to apply the ValidationPipe locally to validate the incoming DTO.
  */
  // @UsePipes(new ValidationPipe())
  @Roles(RoleEnum.ADMIN) // Restrict access to only users with the ADMIN role.
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Put()
  /**
    * Note: If global validation is not enabled, uncomment the @UsePipes decorator to apply the ValidationPipe locally to validate the incoming DTO.
  */
  // @UsePipes(new ValidationPipe())
  async update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }
}