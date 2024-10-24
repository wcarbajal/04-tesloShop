import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create( AppModule );

  const logger = new Logger('bootstrap');
  app.setGlobalPrefix( 'api' ); // Set the API prefix to 'api'

  app.useGlobalPipes(
    new ValidationPipe( {
      whitelist: true,
      forbidNonWhitelisted: true,
    } )
  );

  await app.listen( process.env.PORT );
  logger.log( `Server is running on port ${process.env.PORT}` );
}
bootstrap();
