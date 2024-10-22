import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from 'src/helpers';

@Controller( 'files' )
export class FilesController {

  constructor( private readonly filesService: FilesService ) { }

  @Post( 'product' )
  @UseInterceptors( FileInterceptor( 'file', {
    fileFilter: fileFilter,
    limits: { fileSize: 1000000 }, // 1MB
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer

      
    }),
  } ) )
  uploadProductImage(

    @UploadedFile() file: Express.Multer.File

  ) {
    if ( !file ) {
      throw new BadRequestException( 'Make sure that file is an image' );
    };

    return {
      filename: file.originalname,
    };
  }
}
