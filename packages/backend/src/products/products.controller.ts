import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { ProductsListDto } from './dto/products-list.dto';
import { ProductsService } from './products.service';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: PaginationDto): Promise<ProductsListDto> {
    const page = Number(query.page || 0);
    const limit = Number(Math.min(50, query.limit || 20));

    return {
      products: await this.productsService.getProducts(page, limit)
    };
  }
}
