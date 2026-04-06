import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, ParseUUIDPipe, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { OrderPaginationDto } from './dto';
import { StatusDto } from './dto/status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy
  ) { }

  @Post()
  @ApiOperation({ summary: 'Crear una orden' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente', type: CreateOrderDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createOrderDto: CreateOrderDto) {
    console.log('Entry REST Controller - create order');
    return this.ordersClient.send('createOrder', createOrderDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ordenes' })
  @ApiResponse({ status: 200, description: 'Lista de ordenes con paginacion' })
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto); ///this.ordersService.findAll();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiResponse({ status: 200, description: 'Devuelve la orden correspondiente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    console.log('Entry REST Controller - find one order');
    return this.ordersClient.send('findOneOrder', id)
      .pipe( // Implement observable pipe for chatching exception
        catchError(err => { throw new RpcException(err) })
      );; //this.ordersService.findOne(+id);
  }

  @Get(':status')
  @ApiOperation({ summary: 'Obtener ordenes por estado' })
  @ApiResponse({ status: 200, description: 'Devuelve las ordenes filtradas por estado' })
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {

    return this.ordersClient.send('findAllOrdersByStatus', { status: statusDto.status, ...paginationDto });
  }

  @Patch('id/:id')
  @ApiOperation({ summary: 'Cambiar el estado de una orden' })
  @ApiResponse({ status: 200, description: 'Estado de la orden actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    console.log('Entry REST Controller - change order status');
    return this.ordersClient.send('changeOrderStatus', { ...updateOrderStatusDto, id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

}
