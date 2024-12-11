export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    address: string;
    phoneno: string
    dob?: Date;
    bio?: string;
}