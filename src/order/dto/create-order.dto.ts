import { IsString, IsUUID, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsUUID() // Ensures the userId is a valid UUID
  @IsNotEmpty() // Ensures the userId is not empty
  userId: string;
 
  @IsArray() // Ensures productIds is an array
  @ArrayNotEmpty() // Ensures the array is not empty
  @IsUUID("4", { each: true }) // Ensures each element in the array is a valid UUID
  productIds: string[];
}