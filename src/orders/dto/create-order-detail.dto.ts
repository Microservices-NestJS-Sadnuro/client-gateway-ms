import { IsNumber, IsPositive, IsUUID } from "class-validator";

export class CreateOrderDetailDto {
    @IsNumber()
    @IsPositive()
    productId: number;

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNumber()
    price: number;
}