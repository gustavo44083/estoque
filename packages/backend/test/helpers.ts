import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Product } from '../src/products/product.entity';

export function generateRandomProducts(amount: number) {
  const products: Product[] = [];
  for (let i = 0; i < amount; i++) {
    products.push({
      id: i,
      sku: randomStringGenerator().substring(0, 4) as string,
      title: 'Test Product',
      stock: Math.floor(Math.random() * 1000),
      deleted: Math.random() < 0.2
    });
  }

  return products;
}
