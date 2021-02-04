import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateRandomProducts } from '../../test/helpers';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let app: TestingModule;
  const products: Product[] = generateRandomProducts(100);

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockImplementation((config: any) => {
              // TODO: Test pagination
              return products;
            })
          }
        }
      ]
    }).compile();
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const service = app.get<ProductsService>(ProductsService);
      expect(await service.getProducts(0, 20)).toBe(products);
    });
  });
});
