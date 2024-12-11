export class UpdateUserDto {
    id: string;
    name: string;
    email: string;
    address: string;
    dob?: Date;
    bio?: string;
    phoneno?:string;
}