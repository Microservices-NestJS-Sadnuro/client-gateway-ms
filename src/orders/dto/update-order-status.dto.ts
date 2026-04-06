import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enums/order.enum";

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatusList, {
        message: `Status must be one of ${OrderStatusList.join(', ')}`
    })
    status: OrderStatus;
}