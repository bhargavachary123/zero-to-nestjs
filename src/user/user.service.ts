import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    // Create a new User instance
    const user = new User();
    user.name = createUserDto.name;
    user.password = createUserDto.password;
    user.email = createUserDto.email;
    /*
     * Save the new user to the repository.
     * We used the `save` method instead of `insert`. The `save` method will return the User object after insertion or update, unlike `insert`.
    */
    const new_user = await this.userRepository.save(user);

    // Create a new Profile instance for the user
    const profile = new Profile();
    profile.address = createUserDto.address;
    profile.phone_number = createUserDto.phoneno;
    profile.bio = createUserDto.bio;
    profile.dob = createUserDto.dob;
    profile.user = new_user;  // we can use {user_id:new_user.user_id } as User;  
    await this.profileRepository.insert(profile)
    // Save the profile and assign it to the user
    return { message: "User Created Successfully", user_Id: new_user.user_id };
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: { profile: true } });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { user_id: id }, relations: { profile: true } });
  }

  async findOneUserOrders(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { user_id: id },
      relations: { orders: { products: true } },
      select: {
        user_id: true, name: true,
        orders: {
          order_id: true, ordered_on: true, total: true,
          products: { product_id: true, name: true, price: true }
        }
      }
    });
  }

  async update(updateUserDto: UpdateUserDto): Promise<string> {
    const user = await this.findOne(updateUserDto.id);
    if (!user)
      return "User not found";

    await this.userRepository.update({ user_id: updateUserDto.id }, {
      name: updateUserDto.name,
      email: updateUserDto.email,
    })
    await this.profileRepository.update({ user: { user_id: user.user_id } }, {
      address: updateUserDto.address,
      dob: updateUserDto.dob,
      bio: updateUserDto.bio,
      phone_number: updateUserDto.phoneno
    })
    return "User Updated Successfully";
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { user_id: id }, relations: { profile: true } });
    if (!user)
      return "User not exists!"
    await this.profileRepository.softDelete({ profile_id: user.profile.profile_id })
    await this.userRepository.softDelete({ user_id: id })
    return "User Deleted Successfully";
  }
}