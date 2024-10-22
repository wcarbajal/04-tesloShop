import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { ProductImage } from './product-image.entity';


@Entity({ name: 'products' })
export class Product {

  @PrimaryGeneratedColumn( 'uuid' )
  id: string;

  @Column( 'text', {
    unique: true,
  } )
  title: string;

  @Column( 'float', {
    default: 0.00,
  } )
  price: number;

  @Column( {
    type: 'text',
    nullable: true,
  } )
  description: string;

  @Column( {
    unique: true,
  } )
  slug: string;

  @Column( {
    default: 0,
  } )
  stock: number;

  @Column( 'text', {
    array: true,

  } )
  sizes: string[];

  @Column( 'text', {

  } )
  gender: string;

  @Column( 'text', {
    array: true,
    default: [],
  } )
  tags: string[];

  //image relation
  @OneToMany(
    () => ProductImage,
    ( productImage) => productImage.product,
    { cascade: true, eager: true }

  )
  images?: ProductImage[];

  @BeforeInsert()
  checkSlugInsert() {
    if ( !this.slug ) {
      this.slug = this.title;

    }
    this.slug = this.slug
      .toLowerCase().
      replace( /\s+/g, '_' )
      .replaceAll( "'", '' );
  }
  @BeforeInsert()
  checkSlugUpdate() {

    this.slug = this.slug
      .toLowerCase().
      replace( /\s+/g, '_' )
      .replaceAll( "'", '' );


  }

}
