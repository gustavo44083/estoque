import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, QueryFailedError, Repository } from 'typeorm';
import { DuplicatedKeyException } from '../shared/exceptions/duplicated-key.exception';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async getProducts(page: number, limit: number, search?: string): Promise<Product[]> {
    const options: FindManyOptions<Product> = {
      order: { id: 'ASC' },
      skip: page * limit,
      take: limit
    };

    if (search) {
      search = `%${search}%`;
      options.where = [{ title: Like(search) }, { sku: Like(search) }];
    }

    return this.productRepository.find(options);
  }

  async getProduct(id: number): Promise<Product | void> {
    return this.productRepository.findOne(id).catch(this.handleError);
  }

  async saveProduct(product: Product): Promise<Product> {
    try {
      return await this.productRepository.save(product);
    } catch (e) {
      this.handleError(e);
    }
  }

  async updateProduct(product: Product): Promise<void> {
    try {
      await this.productRepository.update({ id: product.id }, product);
    } catch (e) {
      this.handleError(e);
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    const updateResult = await this.productRepository.softDelete(id);
    return updateResult.affected > 0;
  }

  async deleteMany(ids: number[]): Promise<number> {
    const updateResult = await this.productRepository.softDelete(ids);
    return updateResult.affected;
  }

  private handleError(error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new DuplicatedKeyException(['id', 'sku']);
    }

    throw error;
  }
}
