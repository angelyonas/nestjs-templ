import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/auth.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '09e473a8-8408-4aa1-bc67-c08a38325295',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    uniqueItems: true,
    example: 'T-Shirt example',
    description: 'Product title',
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 100.0,
    description: 'Product price',
    default: 0,
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'T-Shirt example description',
    description: 'Product description',
    default: null,
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 't-shirt-example',
    description: 'Product slug',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 1000,
    description: 'Product available stock',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['XS', 'M', 'L', 'XL'],
    description: 'Product sizes',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product for gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['t-shirt', 'women'],
    description: 'Product tags',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
