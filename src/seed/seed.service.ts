import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt' 

@Injectable()
export class SeedService {
 
  constructor(
    private readonly productsService:ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async productSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();

    return await this.addNewProducts(adminUser);
  }


  private async insertUsers(){
    const seedUsers = initialData.users;
    const users:User[] = [];

    seedUsers.forEach(user=> 
      users.push(this.userRepository.create({
          ...user, 
          password: bcrypt.hashSync(user.password, 10)
      }))
    )

    await this.userRepository.save(users)
    return users[0];
  }

  private async addNewProducts(user:User){
    await this.productsService.deleteAllProductsForSeed();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push( this.productsService.create(product, user) );
    })

    await Promise.all(insertPromises);

    return true;
  }




  private async deleteTables(){
    await this.productsService.deleteAllProductsForSeed();
    
    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete()
          .where({})
          .execute();
    
          return true;
  }
}
