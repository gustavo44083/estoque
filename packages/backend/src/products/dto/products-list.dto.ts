import { Type } from 'class-transformer';
import { Product } from '../product.entity';

export class ProductsListDto {
  @Type(() => Product)
  products: Product[];
}
