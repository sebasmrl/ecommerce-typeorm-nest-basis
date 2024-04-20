import { Controller, Post, Body, Get, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }
  
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  

  @Get('test-private')
  @UseGuards( AuthGuard())
  testPrivateRoute(
   @GetUser() user: User,
   @GetUser('email') email: string,
   @RawHeaders() rawHeaders: string[],
   @Headers() headers: IncomingHttpHeaders
  ){  

    return { 
      message: "test private route JWT",
      user, 
      email,
      rawHeaders,
      headers,

    }
  }

  @Get('test-private-2')
  @SetMetadata('roles',['admin', 'superuser'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  testPrivateRoute2(
    @GetUser() user: User,
  ){
    return user;
  }
}
