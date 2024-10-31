import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

  constructor(

    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    configServices: ConfigService,

  ) {
    super( {
      secretOrKey: "Etvmqed1821",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    } );
  }

  async validate( payload: JwtPayload ): Promise<User> {




    const { id } = payload;

    const user = await this.userRepository.findOneBy( { id } );

    if ( !user ) {
      throw new UnauthorizedException( 'Tokeon no valido ' );
    }
    if ( !user.isActive ) {

      throw new UnauthorizedException( 'Usuario no activo' );
    }


    return user;
  }
}