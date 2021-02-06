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
  @Column({unique: true})
  sku: string;

  @IsNumber()
  @IsOptional()
  @Column({default: 0})
  stock: number;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
