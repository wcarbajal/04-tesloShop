import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, ProductImage } from './entities';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]), // Import the Product entity from your entities folder
  ], 
  exports: [ 
    ProductsService, 
    TypeOrmModule
   ] // Make the ProductsService available for other modules to use.
})
export class ProductsModule {}
