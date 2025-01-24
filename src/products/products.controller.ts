import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto';
import { Product } from '@prisma/client';
import { PaginationResponse } from '../common/interfaces/pagination-response';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(
    @Payload() paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Product>> {
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(
    // @Param('id', ParseIntPipe) id: number,
    // @Body() updateProductDto: UpdateProductDto,
    @Payload() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: 'validate_product' })
  validateProduct(@Payload() ids: number[]): Promise<Product[]> {
    return this.productsService.validate(ids);
  }
}
