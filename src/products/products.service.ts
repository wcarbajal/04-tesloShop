import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { validate as isUUID } from "uuid";


@Injectable()
export class ProductsService {

  private readonly logger = new Logger( 'ProductsService' );

  constructor(

    @InjectRepository( Product )
    private readonly productRepository: Repository<Product>,

    @InjectRepository( ProductImage )
    private readonly productImagesRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,


  ) { }


  async create( createProductDto: CreateProductDto ) {

    try {

      const { images = [], ...productDetails } = createProductDto;

      const product = await this.productRepository.create( {
        ...productDetails,
        images: images.map( image => this.productImagesRepository.create( { url: image } ) )
      } );

      await this.productRepository.save( product );
      return { ...product, images };

    } catch ( error: any ) {

      this.handleDBExceptions( error );

    }

  }

  //todo:paginar
  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find( {
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    } );


    return products.map( product => ( {
      ...product,
      images: product.images.map( image => image.url )
    } ) );;
  }

  async findOne( term: string ) {

    let product: Product;


    if ( isUUID( term ) ) {
      product = await this.productRepository.findOneBy( { id: term } );
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder( 'prod' );
      product = await queryBuilder
        .where( 'UPPER(slug) =:slug or title =:title', {
          slug: term.toUpperCase(),
          title: term.toLowerCase()
        } )
        .leftJoinAndSelect( 'prod.images', 'prodImages' )
        .getOne();
    }

    if ( !product ) {
      throw new NotFoundException( `Product with ${ term } not found` );
    }

    return product;
  }


  async findOnePlain( term: string ) {

    const { images, ...rest } = await this.findOne( term );


    return { ...rest, images: images.map( image => image.url ) };

  }

  async update( id: string, updateProductDto: UpdateProductDto ) {

    const { images = [], ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload( {
      id,
      ...toUpdate
    } );

    if ( !product ) { throw new NotFoundException( `Product with id # ${ id } not found` ); }

    //cReate query runner

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if ( images ) {
        await queryRunner.manager.delete( ProductImage, { product: id } );

        product.images = images.map(
          image => this.productImagesRepository.create( { url: image } )
        )
          ;
      } else {
        // ???
        // product.images ???
      }
      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release();


      //await this.productRepository.save( product );
      return this.findOnePlain(id);

    } catch ( error: any ) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions( error );
    }


  }

  async remove( id: string ) {
    const product = await this.findOne(  id  );

    (await this.productRepository.remove( product ));

    
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' ) {
      throw new BadRequestException( error.detail );
    }

    this.logger.error( error );
    throw new InternalServerErrorException( 'Ayuda' );

  }
  async deleteAllProducts() {
    const query = await this.productRepository.createQueryBuilder('product');

    try {
      return await query
      .delete()
      .where({})
      .execute();
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


}
