import { PaginationDto } from '../../shared/dto/pagination.dto';

export class ProductsQueryDto extends PaginationDto {
  search: string
}
