import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { PaginationDto } from '../common/dto';
import { PaginationResponse } from '../common/interfaces/pagination-response';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: { data: Prisma.ProductCreateInput }): Promise<Product> {
    const { data } = params;
    return this.prisma.product.create({ data });
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Product>> {
    const { page, limit } = paginationDto;
    const totalProducts = await this.prisma.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalProducts / limit);
    return {
      data: await this.prisma.product.findMany({
        where: { available: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalProducts,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id, available: true },
    });
    if (!product)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id #${id} not found`,
      });
    return product;
  }

  async update(
    id: number,
    updateProductDto: Omit<UpdateProductDto, 'id'>,
  ): Promise<Product> {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number): Promise<Product> {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
  }

  async validateProducts(ids: number[]): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        available: true,
        id: {
          in: ids,
        },
      },
    });
  }
}
