import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';


export class CreateProductDto {

  @IsString({message: 'El titulo debe ser string' })
  @MinLength( 1, {message: 'El titulo debe tener por lo menos un caracter' } )
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString( { each: true } )
  @IsArray()
  sizes: string[];

  @IsIn( [ 'men', 'woman', 'kid', 'unisex' ] )
  gender: string;

}
