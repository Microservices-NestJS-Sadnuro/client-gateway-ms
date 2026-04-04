import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    console.log('Entry REST Controller - create order');
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersClient.send('findAllOrders', paginationDto); ///this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.ordersClient.send('findOne', { id })
      .pipe( // Implement observable pipe for chatching exception
        catchError(err => { throw new RpcException(err) })
      );; //this.ordersService.findOne(+id);
  }

  @Patch(':id')
  changeOrderStatus(@Query('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersClient.send('changeOrderStatus', { id, ...updateOrderDto })

  }

}
