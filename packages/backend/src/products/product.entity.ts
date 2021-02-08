import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  title: string;

  @IsString()
  @Column({ unique: true })
  sku: string;

  @IsNumber()
  @Column({ type: 'double' })
  price: number;

  @IsNumber()
  @IsOptional()
  @Column({ default: 0 })
  stock: number = 0;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(product: Partial<Product>) {
    Object.assign(this, product);
  }
}
