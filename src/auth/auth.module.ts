import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


@Module( {
  controllers: [ AuthController ],
  providers: [ AuthService ],
  imports: [
    TypeOrmModule.forFeature( [ User ] ),

    PassportModule.register( { defaultStrategy: 'jwt' } ),

    JwtModule.registerAsync( {
      imports: [ ConfigModule],
      inject: [ ConfigService],
      useFactory: ( configServices: ConfigService) => {
        //console.log( configServices.get('JWT_SECRET') );
        return {
          secret: configServices.get('JWT_SECRET') || 'secret',
          signOptions: { expiresIn: '2h'             
          }
        };
      }
    } )
    /* JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '2h' },
    }) */
  ],
  exports: [ TypeOrmModule ],
} )
export class AuthModule { }
