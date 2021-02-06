import { BadRequestException } from '@nestjs/common';

export class DuplicatedKeyException extends BadRequestException {
  constructor(uniqueKeys: string[]) {
    super(`Duplicate key: ${uniqueKeys} must be unique`);
  }
}
