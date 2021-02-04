import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async getProducts(page: number, limit: number): Promise<Product[]> {
    // TODO: Basic listing
    // TODO: Pagination
    return this.productRepository.find({
      order: { id: 'ASC' },
      skip: limit,
      take: page
    });
  }
}
