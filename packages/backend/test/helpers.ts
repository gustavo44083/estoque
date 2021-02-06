import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { plainToClass } from 'class-transformer'
import { Product } from '../src/products/product.entity';

export function generateRandomProducts(amount: number) {
  const products: Product[] = [];
  const generatedSkus = []
  for (let i = 0; i < amount; i++) {
    let sku;
    while(!sku || sku in generatedSkus) {
      sku = randomStringGenerator().substring(0, 6).toUpperCase()
    }

    products.push(plainToClass(Product, {
      id: i,
      sku: sku,
      title: 'Test Product',
      stock: Math.floor(Math.random() * 1000),
      deleted: Math.random() < 0.2
    }));
  }

  return products;
}
