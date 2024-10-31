import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller( 'auth' )
export class AuthController {
  constructor( private readonly authService: AuthService ) { }

  @Post( 'register' )
  create( @Body() createUserDto: CreateUserDto ) {
    return this.authService.create( createUserDto );
  }

  @Post( 'login' )
  loginUser( @Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }
  @Get( 'private' )
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser(  ) user: User,
    @GetUser( 'email', ) userEmail: string
  ) {

    console.log(request);
    
    return {
      ok: true,
      message: 'Hola mundo private 5',
      user,
      userEmail
    }; // This will be returned if the token is valid and the user has the required role. Otherwise, it will return a 401 Unauthorized error.
  }


}
