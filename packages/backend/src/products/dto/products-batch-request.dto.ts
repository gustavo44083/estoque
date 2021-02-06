import { IsArray, IsNumber } from 'class-validator';

export class ProductsBatchRequestDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
