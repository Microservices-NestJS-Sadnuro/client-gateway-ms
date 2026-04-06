import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from 'src/common/dtos/create-product.dto';
import { UpdateProductDto } from 'src/common/dtos/update-product.dto';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) { }

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Devuelve una lista de productos' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Devuelve el producto correspondiente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findByID(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe( // Implement observable pipe for chatching exception
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, { ...updateProductDto, id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }
}
