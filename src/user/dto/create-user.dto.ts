import { IsString, IsEmail, IsNotEmpty, Length, IsOptional, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 20)
  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(8, 10)
  @IsNotEmpty()
  phoneno: string

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsDateString()
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsOptional()
  bio?: string;
}