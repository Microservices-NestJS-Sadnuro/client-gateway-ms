import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() { }

  @Post()
  create() {
    return 'Create product';
  }

  @Get()
  findAll() {
    return 'Find all products';
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
