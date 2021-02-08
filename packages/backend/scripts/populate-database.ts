import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as path from 'path';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Product } from '../src/products/product.entity';
import { generateRandomProducts } from '../test/helpers';

async function main() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(path.basename(__filename));
  const productRepository: Repository<Product> = app.get(getRepositoryToken(Product));

  const product = await productRepository.findOne();
  if (!product) {
    logger.log('Inserting random products...');
    const products = generateRandomProducts(500).map((p) => {
      delete p.id;
      return p;
    });

    await productRepository.insert(products);
  } else {
    logger.log('Database already populated, skipping');
  }

  logger.log('Populate script finished');
  await app.close();
}

main()
