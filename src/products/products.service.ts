import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

import {  validate as  isUUID } from "uuid";

@Injectable()
export class ProductsService {

  private readonly logger = new Logger( 'ProductsService' );

  constructor(

    @InjectRepository( Product )
    private readonly productRepository: Repository<Product>,

  ) { }


  async create( createProductDto: CreateProductDto ) {

    try {

      
      const product = await this.productRepository.create( {
        ...createProductDto, 
      images: []     } );
      await this.productRepository.save( product );
      return product;

    } catch ( error: any ) {

      this.handleDBExceptions( error );

    }

  }

  //todo:paginar
  findAll( paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    
    const products = this.productRepository.find({
      take: limit,
      skip: offset,
      //todo:relaciones
    });

    return products;
  }

  async findOne( term: string ) {
    
    let product: Product;

    if ( isUUID( term ) ) {
      product = await this.productRepository.findOneBy( {id: term} );
    } else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
                .where( 'UPPER(slug) =:slug or title =:title', {
                  slug: term.toUpperCase(),
                  title: term.toLowerCase()
                } )
                .getOne();    
    }
    
    if ( !product ) {
      throw new NotFoundException( `Product with ${ term } not found` );
    }
    return product;
  }

  async update( id: string, updateProductDto: UpdateProductDto ) {
    
    const product = await this.productRepository.preload({
      id, 
      ...updateProductDto,
      images: []
    })
    
    if(!product ) { throw new NotFoundException( `Product with id # ${ id } not found` );}
    
    
    try {
      
     await this.productRepository.save( product );
     return product;
     
    } catch (error: any) {
      this.handleDBExceptions( error );
    }

    
  }

  async remove( id: string ) {
    const product = await this.productRepository.delete( { id } );

    if ( product.affected === 0 ) {
      throw new NotFoundException( `Product with id # ${ id } not found` );
    }

    return `This action removes a #${ id } product`;
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' ) {
      throw new BadRequestException( error.detail );
    }

    this.logger.error( error );
    throw new InternalServerErrorException( 'Ayuda' );

  }

 
}
