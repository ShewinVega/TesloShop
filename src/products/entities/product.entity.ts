import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ProductImage } from './index';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

  @ApiProperty({
    example: `08f56ce4-5b0a-47d6-bc5e-8569bd25e4ab`,
    description: `Product ID`,
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: `T-shirt Teslo`,
    description: `Product title`,
    uniqueItems: true
  })
  @Column('text', { 
    unique: true
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: `Product Price`,
    minimum: 0
  })
  @Column('float',{
    default: 0
  })
  price: number;

  @ApiProperty({
    example: `lorem ipsum deadfn hanofmdlfdmf`,
    description: `Product Description`,
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: `t-shirt teslo`,
    description: `Product Slug - for SEO`,
    uniqueItems: true
  })
  @Column('text',{
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: `Product Stock`,
    minimum: 0,
    default: 0
  })
  @Column('int',{
    default: 0
  })
  stock: number;

  @ApiProperty({
    example: ['M','XL','XXL'],
    description: `Product Size`
  })
  @Column('text',{
    array: true
  })
  sizes: string[];

  @ApiProperty({
    example: 'Male or Female',
    description: `Product Gender`,
    uniqueItems: true
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text',{
    array: true,
    default: []
  })
  tags: string[];


  // Images
  @ApiProperty()
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  registerBy: User;


  @BeforeInsert()
  checkSlugInsert() {

    if(!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ','_')
      .replaceAll("'",'')
  }

  @BeforeUpdate()
  checkSlugUpdate() {

    if(this.slug) {
      this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }

  }



}
