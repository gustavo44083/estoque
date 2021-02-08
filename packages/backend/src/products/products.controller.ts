import {
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

  /**
   * Retorna uma lista de produtos com base na query solicitada.
   * Não inclui produtos deletados.
   *
   * O número máximo de produtos por busca é de 50.
   *
   * @param query Query solicitada
   * @returns Um objeto com a lista de produtos encontrados
   */
  @Get()
  async getProducts(@Query() query: ProductsQueryDto): Promise<ProductsListDto> {
    const page = Number(query.page || 0);
    const limit = Number(Math.min(50, query.limit || 20));

    const products = await this.productsService.getProducts(page, limit, query.search);
    return plainToClass(ProductsListDto, { products: products });
  }

  /**
   * Retorna um produto pelo seu ID.
   *
   * @param id ID do produto
   * @returns Os dados do produto encontrado
   * @throws NotFoundException Caso o produto não seja encontrado
   */
  @Get(':id')
  async getProduct(@Param('id', new ParseIntPipe()) id: number): Promise<Product> {
    const product = await this.productsService.getProduct(id);
    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  /**
   * Atualiza os dados de um produto existente.
   *
   * @param id ID do produto
   * @param product Novos dados do produto
   * @returns O produto atualizado
   */
  @Put(':id')
  async updateProduct(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() product: Product
  ): Promise<Product> {
    delete product.id;
    await this.productsService.updateProduct(id, product);
    return this.getProduct(id);
  }

  /**
   * Cadastra um novo produto.
   *
   * @param product Dados do novo produto
   * @returns Os dados do novo produto cadastrado
   */
  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    delete product.id;
    return this.productsService.saveProduct(product);
  }

  /**
   * Deleta (soft delete) um produto existente.
   *
   * @param id ID do produto
   */
  @Delete(':id')
  async deleteProduct(@Param('id', new ParseIntPipe()) id: number) {
    await this.productsService.deleteProduct(id);
  }

  /**
   * Deleta (soft delete) múltiplos produtos.
   *
   * @param batchRequestDto Solicitação com os IDs dos produtos para deletar
   */
  @Delete()
  async deleteManyProducts(
    @Body() batchRequestDto: ProductsBatchRequestDto
  ): Promise<ProductsBatchDeleteResultDto> {
    return {
      deleted: await this.productsService.deleteMany(batchRequestDto.ids)
    };
  }
}
