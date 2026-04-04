import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsPositive, IsString } from "class-validator";

export enum OrderStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export class CreateOrderDto {
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    totalAmount: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    totalItems: number;

    @IsEnum(OrderStatus)
    status: OrderStatus;

    // @IsBoolean()
    // paid: boolean;

    // @IsDate()
    // @Type(() => Date)
    // paidAt: Date;
}
