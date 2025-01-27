import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsDate()
    @IsOptional()
    dob: Date;

    @IsString()
    @IsOptional()
    bio: string;

    @IsString()
    @IsOptional()
    phoneno: string;
}