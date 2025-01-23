import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { PaginationDto } from '../common/dto';
import { PaginationResponse } from '../common/interfaces/pagination-response';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.create({
      data: createProductDto,
    });
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Product>> {
    return this.productsRepository.findAll(paginationDto);
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { id: _, ...rest } = updateProductDto;
    return this.productsRepository.update(id, rest);
  }

  async remove(id: number): Promise<Product> {
    return this.productsRepository.remove(id);
  }
}
