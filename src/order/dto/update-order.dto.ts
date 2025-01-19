import { IsNotEmpty, IsString } from "class-validator";

export class UpdateOrderDto {
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsNotEmpty()
    @IsString({ each: true })
    productIds: string[];  // updated products list
}