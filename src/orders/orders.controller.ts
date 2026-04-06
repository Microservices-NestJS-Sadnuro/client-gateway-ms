import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, ParseUUIDPipe, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { OrderPaginationDto } from './dto';
import { StatusDto } from './dto/status.dto';

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
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto); ///this.ordersService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    console.log('Entry REST Controller - find one order');
    return this.ordersClient.send('findOneOrder', id)
      .pipe( // Implement observable pipe for chatching exception
        catchError(err => { throw new RpcException(err) })
      );; //this.ordersService.findOne(+id);
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {

    return this.ordersClient.send('findAllOrdersByStatus', { status: statusDto.status, ...paginationDto });
  }

  @Patch(':id')
  changeOrderStatus(@Query('id', ParseUUIDPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersClient.send('changeOrderStatus', { ...updateOrderDto, id })

  }

}
