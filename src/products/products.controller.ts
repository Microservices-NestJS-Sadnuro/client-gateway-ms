import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) { }

  @Post()
  create() {
    return 'Create product';
  }

  @Get()
  findAll() {
    return this.productsClient.send({ cmd: 'find_all_products' }, {});
  }

  @Get(':id')
  findByID(@Param('id', ParseIntPipe) id: number) {
    return 'Find product by id: ' + id;
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return 'Update product with ID:' + id;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return 'Delete product with ID:' + id;
  }
}
