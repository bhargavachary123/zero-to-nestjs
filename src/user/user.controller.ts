import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseUUIDPipe } from 'src/config/custom/parse-uuid.pipe';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from './entities/user.entity';
import { RolesGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/passport/jwt.guard';

@Controller('user')
// @UsePipes(new ValidationPipe())  // Apply ValidationPipe at the controller level to validate all incoming requests.
/*
  * Below guard will restricts access to all methods in the controller to only users with the ADMIN role.
  * If you want to restrict access to specific methods, apply the Roles decorator to the specific method.
*/
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  /**
    * Note: If global validation is not enabled, uncomment the @UsePipes decorator to apply the ValidationPipe locally to validate the incoming DTO.
  */
  // @UsePipes(new ValidationPipe())
  @Roles(RoleEnum.ADMIN) // Restrict access to only users with the ADMIN role.
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('userorders/:id')
  async findOneUserOrders(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOneUserOrders(id);
  }


  @Put()
  /**
    * Note: If global validation is not enabled, uncomment the @UsePipes decorator to apply the ValidationPipe locally to validate the incoming DTO.
  */
  // @UsePipes(new ValidationPipe())
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}