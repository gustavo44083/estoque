import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { DuplicatedKeyException } from '../shared/exceptions/duplicated-key.exception';
import { ProductsBatchDeleteResultDto } from './dto/products-batch-delete-result.dto';
import { ProductsBatchRequestDto } from './dto/products-batch-request.dto';
import { ProductsListDto } from './dto/products-list.dto';
import { ProductsQueryDto } from './dto/products-query.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Controller('/products')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: ProductsQueryDto): Promise<ProductsListDto> {
    const page = Number(query.page || 0);
    const limit = Number(Math.min(50, query.limit || 20));

    const products = await this.productsService.getProducts(page, limit, query.search);
    return plainToClass(ProductsListDto, { products: products });
  }

  @Get(':id')
  async getProduct(@Param('id', new ParseIntPipe()) id: number): Promise<Product> {
    const product = await this.productsService.getProduct(id);
    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  @Put(':id')
  async editProduct(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() product: Product
  ): Promise<Product> {
    product.id = id;
    await this.productsService.updateProduct(product);
    return this.getProduct(id);
  }

  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    delete product.id;
    return this.productsService.saveProduct(product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', new ParseIntPipe()) id: number) {
    await this.productsService.deleteProduct(id);
  }

  @Delete()
  async deleteManyProducts(
    @Body() batchRequestDto: ProductsBatchRequestDto
  ): Promise<ProductsBatchDeleteResultDto> {
    return {
      deleted: await this.productsService.deleteMany(batchRequestDto.ids)
    };
  }
}
