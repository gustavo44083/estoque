import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { UpdateResult } from 'typeorm';
import { generateRandomProducts } from '../../test/helpers';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

export class ProductRepositoryMock {
  database: Product[] = [];

  async _getAProduct(): Promise<Product> {
    return { ...(await this.find())[0] };
  }

  find = jest.fn().mockImplementation(async (config: any) => {
    const where = config?.where || {};
    const filtered = _.filter(this.database, { deletedAt: null, ...where });
    return filtered.slice(config?.skip || 0, config?.take || filtered.length);
  });

  findOne = jest.fn().mockImplementation(async (id: number) => {
    return this.database.find((p) => p.id == id && !p.deletedAt) || null;
  });

  save = jest.fn().mockImplementation(async (product: Product) => {
    product = { ...product };
    if (product.id !== undefined) {
      this.update({ id: product.id }, _.omit(product, 'id'));
    } else {
      product.id = this.database.length;
      this.database.push(product);
    }

    return this.findOne(product.id);
  });

  update = jest
    .fn()
    .mockImplementation(async (criteria: Partial<Product>, product: Partial<Product>) => {
      product = { ...product };
      expect(product.id).not.toBeNull();

      const existingProduct = _.find(this.database, criteria);
      expect(existingProduct).not.toBeNull();

      this.database = _.reject(this.database, criteria);
      this.database.push({ ...existingProduct, ...product } as Product);
    });

  softDelete = jest.fn().mockImplementation(
    async (ids: number | number[]): Promise<Partial<UpdateResult>> => {
      const idsArray: number[] = Array.isArray(ids) ? ids : [ids];
      const products = _.filter(this.database, (p) => idsArray.includes(p.id));
      products.forEach((p) => (p.deletedAt = new Date()));
      return {
        affected: products.length
      };
    }
  );
}

describe('ProductsService', () => {
  let app: TestingModule;
  let productService: ProductsService;
  const productRepositoryMock = new ProductRepositoryMock();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    productService = app.get(ProductsService);
  });

  beforeEach(async () => {
    productRepositoryMock.database = generateRandomProducts(100);
  });

  describe('getProducts', () => {
    it('should return the first 20 products', async () => {
      expect(await productService.getProducts(0, 20)).toHaveLength(20);
    });

    it('should not include deleted products', async () => {
      const products = await productService.getProducts(0, productRepositoryMock.database.length);
      expect(products.some((value) => value.deletedAt)).toBe(false);
    });
  });

  describe('getProduct', () => {
    it('should return an existing product', async () => {
      const id = (await productRepositoryMock._getAProduct()).id;
      expect(await productService.getProduct(id)).not.toBeNull();
    });
  });

  describe('saveProduct', () => {
    it('should save a new product', async () => {
      const product = await productService.saveProduct({
        sku: 'NEW001',
        title: 'New product',
        stock: 0
      });

      expect(productRepositoryMock.save).toBeCalled();
      expect(productService.getProduct(product.id)).not.toBeNull();
    });

    it('should save an existing product', async () => {
      const newTitle = 'Modified product';
      const product = await productRepositoryMock._getAProduct();

      product.title = newTitle;
      await productService.saveProduct(product);

      expect(productRepositoryMock.save).toBeCalled();
      expect((await productService.getProduct(product.id)).title). toBe(newTitle);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const newTitle = 'Updated product';
      const product = await productRepositoryMock._getAProduct();
      await productService.updateProduct(product.id, { title: newTitle });

      expect(productRepositoryMock.update).toBeCalled();
      expect((await productService.getProduct(product.id)).title).toBe(newTitle);
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const id = (await productRepositoryMock._getAProduct()).id;
      expect(await productService.getProduct(id)).not.toBeNull();

      await productService.deleteProduct(id);
      expect(productRepositoryMock.softDelete).toBeCalled();
      expect(await productService.getProduct(id)).toBeNull();
    });
  });

  describe('deleteMany', () => {
    it('should delete many products', async () => {
      const products = await productService.getProducts(0, 5);
      await productService.deleteMany(products.map((p) => p.id));

      expect(productRepositoryMock.softDelete).toBeCalled();
      for (let product of products) {
        expect(await productService.getProduct(product.id)).toBeNull();
      }
    });
  });
});
