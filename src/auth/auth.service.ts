import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { LoginUserDto } from './dto';
import { JwtPayload } from './strategies/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService


  ) { }


  async create( createUserDto: CreateUserDto ) {

    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create( {
        ...userData,
        password: await bcrypt.hashSync( password, 10 ),

      } );


      await this.userRepository.save( user );

      delete user.password;

      return { 
        ...user,
        token: this.getJwtToken( {email: user.email})
      };
      //TODO: retornar el JWT de acceso

    } catch ( error ) {
      this.handleDBErrors( error );

    }


  }

  async login( { email, password }: LoginUserDto ) {


    const user = await this.userRepository.findOne(
      {
        where: { email },
        select: { email: true, password: true }
      }
    );

    if ( !user ) {
      throw new UnauthorizedException( 'Credentials are not valid (email)' );
    }
    if ( !bcrypt.compareSync( password, user.password ) ) {
      throw new UnauthorizedException( 'Credentials are not valid (password)' );
    }

    return { 
      ...user,
      token: this.getJwtToken( {email: user.email})
    };
    //TODO: retornar el JWT de acceso

  }

  private getJwtToken( payload: JwtPayload) {

    const token = this.jwtService.sign( payload);

    return token;

  }

  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' ) {
      throw new BadRequestException( error.detail );
    }

    console.log( error );
    throw new InternalServerErrorException( 'Please check server logs' );
  }

}