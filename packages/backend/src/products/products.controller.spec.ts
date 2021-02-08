import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateRandomProducts } from '../../test/helpers';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepositoryMock } from './products.service.spec';

describe('ProductsController', () => {
  let app: TestingModule;
  let productsController: ProductsController;
  let productsService: ProductsService;
  const productRepositoryMock = new ProductRepositoryMock();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        ProductsController,
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepositoryMock
        }
      ]
    }).compile();

    productsController = app.get(ProductsController);
    productsService = app.get(ProductsService);
  });

  beforeEach(async () => {
    productRepositoryMock.database = generateRandomProducts(100);
  });

  describe('getProducts', () => {
    it('should return the first 20 products', async () => {
      const limit = 20;
      const data = await productsController.getProducts({ page: 0, limit: limit });
      expect(data.products).toHaveLength(limit);
    });

    it('should not include deleted products', async () => {
      const data = await productsController.getProducts({ page: 0, limit: 50 });
      expect(data.products.some((p) => p.deletedAt)).toBe(false);
    });
  });

  describe('getProduct', () => {
    it('should return a product', async () => {
      const product = await productsController.getProduct(
        (await productRepositoryMock._getAProduct()).id
      );

      expect(product).not.toBeNull();
    });

    it("should return 404 if a product doesn't exist", async () => {
      const action = async () =>
        productsController.getProduct(productRepositoryMock.database.length);
      await expect(action()).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const newTitle = 'Updated title';
      const product = await productRepositoryMock._getAProduct();
      const data = await productsController.updateProduct(
        product.id,
        new Product({ title: newTitle })
      );

      expect(data.title).toEqual(newTitle);
      expect((await productsController.getProduct(product.id)).title).toBe(newTitle);
    });

    it("shouldn't change the product's ID", async () => {
      const product = await productRepositoryMock._getAProduct();
      const data = await productsController.updateProduct(product.id, new Product({ id: 1000 }));

      expect(data.id).toBe(product.id);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const product = new Product({ title: 'test', sku: 'NEW001', stock: 1 });
      const created = await productsController.createProduct(product);
      expect(created.id).not.toBeNull();
      expect(created.title).toBe(product.title);
      expect(created.sku).toBe(product.sku);
      expect(created.stock).toBe(product.stock);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const product = await productRepositoryMock._getAProduct();
      await productsController.deleteProduct(product.id);

      const action = async () => productsController.getProduct(product.id);
      await expect(action()).rejects.toThrowError(NotFoundException);
    });
  });

  describe('deleteManyProducts', () => {
    it('should delete many products', async () => {
      const products = await productsService.getProducts(0, 5);
      await productsController.deleteManyProducts({ ids: products.map((p) => p.id) });

      const action = async (id) => productsController.getProduct(id)
      for (let product of products) {
        await expect(action(product.id)).rejects.toThrowError(NotFoundException)
      }
    });
  });
});
