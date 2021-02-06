import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { generateRandomProducts } from '../../test/helpers';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let app: TestingModule;
  let productService: ProductsService;
  let productDatabase: Product[];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockImplementation((config: any) => {
              const filtered = _.filter(productDatabase, config.where);
              return filtered.slice(config.skip, config.take);
            })
          }
        }
      ]
    }).compile();

    productService = app.get<ProductsService>(ProductsService);
  });

  beforeEach(async () => {
    productDatabase = generateRandomProducts(100);
  });

  describe('getProducts', () => {
    it('should return the first 20 products', async () => {
      expect(await productService.getProducts(0, 20)).toHaveLength(20);
    });

    it('should not include deleted products', async () => {
      const products = await productService.getProducts(0, productDatabase.length);
      expect(products.some((value) => value.deleted)).toBe(false);
    });
  });
});
