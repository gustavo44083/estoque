import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, QueryFailedError, Repository } from 'typeorm';
import { DuplicatedKeyException } from '../shared/exceptions/duplicated-key.exception';
import { Product } from './product.entity';

/**
 * Esta classe é responsável por gerir o cadastro de produtos e os produtos cadastrados.
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  /**
   * Lista os produtos cadastrados utilizando os parâmetros de paginação e pesquisa fornecidos.
   * Não inclui produtos deletados.
   *
   * @param page Página atual (começa em 0)
   * @param limit Limite de produtos retornados
   * @param search Parâmetro de pesquisa (opcional)
   * @returns Os produtos encontrados
   */
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

  /**
   * Busca um produto por seu ID.
   *
   * @param id ID do produto
   * @returns O produto encontrado, ou `null`
   */
  async getProduct(id: number): Promise<Product | null> {
    try {
      return this.productRepository.findOne(id);
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * Salva um novo produto ou atualiza um existente.
   *
   * @param product Produto que será criado ou atualizado
   * @returns O produto salvo
   */
  async saveProduct(product: Partial<Product>): Promise<Product> {
    try {
      return await this.productRepository.save(product);
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * Atualiza um produto existente.
   *
   * @param id ID do produto existente
   * @param product Novos dados do produto
   */
  async updateProduct(id: number, product: Partial<Product>): Promise<void> {
    try {
      await this.productRepository.update({ id }, product);
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * Deleta (soft delete) um produto existente.
   *
   * @param id ID do produto
   * @returns `true` caso o produto foi deletado com sucesso
   */
  async deleteProduct(id: number): Promise<boolean> {
    const updateResult = await this.productRepository.softDelete(id);
    return updateResult.affected > 0;
  }

  /**
   * Deleta (soft delete) múltiplos produtos.
   *
   * @param ids IDs dos produtos
   * @returns Quantidade de produtos deletados
   */
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
