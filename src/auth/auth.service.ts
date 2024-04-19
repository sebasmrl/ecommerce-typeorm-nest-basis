import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JWTPayload } from './interfaces';


@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}


  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const newPassword = bcrypt.hashSync(password, 10);

      const user = this.userRepository.create({
        password: newPassword,
        ...userData
      }); //preparacion
      await this.userRepository.save(user);  

      delete user.password;

      //TODO: Return JWT like response
      return {
        ...user, 
        token: this.generateJwt({id: user.id})
      }

    } catch (e) {
      console.log(e)
      this.handleDBErrors(e);
    }
  }

  async login(loginUserDto: LoginUserDto) {
      const { password, email} =  loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email: email}, 
        select: {email:true, password:true, id:true}
      });

      if(!user) 
        throw new UnauthorizedException('Credentials are not valid (email)');

      if(!bcrypt.compareSync(password, user.password)) 
        throw new UnauthorizedException('Credentials are not valid (password)');

      return {
        ...user, 
        token: this.generateJwt({id: user.id})
      }
  }


  
  private generateJwt(payload: JWTPayload){
    const token = this.jwtService.sign(payload);
    console.log(payload)
    return token;
  }
  
  
  private handleDBErrors(e:any):never{
    this.logger.error(`${e.detail}`);
    if(e.code === '23505') 
      throw new BadRequestException(`Error when try create a user: ${e.detail}`);

    throw new InternalServerErrorException('Contact to Admin User for more information');

  }

}
