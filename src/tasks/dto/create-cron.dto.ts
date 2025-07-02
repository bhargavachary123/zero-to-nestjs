import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCronDto {
  @IsString() 
  @IsNotEmpty()
  name: string;

  @IsString() 
  @IsNotEmpty()
  cronTime: string;

  @IsString() 
  @IsNotEmpty()
  callbackType: string;
}
