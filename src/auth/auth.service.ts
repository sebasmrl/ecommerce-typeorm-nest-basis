import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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
      return user;
      //TODO: Return JWT like response

    } catch (e) {
      console.log(e)
      this.handleDBErrors(e);
    }
  }
  
  
  
  
  private handleDBErrors(e:any):never{
    this.logger.error(`${e.detail}`);
    if(e.code === '23505') 
      throw new BadRequestException(`Error when try create a user: ${e.detail}`);

    throw new InternalServerErrorException('Contact to Admin User for more information');

  }

}
