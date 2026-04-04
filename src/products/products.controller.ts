import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
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
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  async findByID(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe( // Implement observable pipe for chatching exception
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, { ...updateProductDto, id });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id });
  }
}
