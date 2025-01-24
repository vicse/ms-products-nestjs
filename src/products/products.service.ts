import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { PaginationDto } from '../common/dto';
import { PaginationResponse } from '../common/interfaces/pagination-response';
import { ProductsRepository } from './products.repository';
import { RpcException } from '@nestjs/microservices';

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

  async validate(ids: number[]): Promise<Product[]> {
    const uniqueIds = [...new Set(ids)];
    const products = await this.productsRepository.validateProducts(uniqueIds);
    if (products.length !== uniqueIds.length) {
      throw new RpcException({
        message: 'Some products were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return products;
  }
}
