import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTimeoutDto {
  @IsString() 
  @IsNotEmpty()
  name: string;

  @IsNumber() 
  @Min(1)
  milliseconds: number;

  @IsString() 
  @IsNotEmpty()
  callbackType: string;
}