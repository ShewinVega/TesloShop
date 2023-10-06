import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {
  

  constructor(
    private readonly productServices: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async runSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertNewProducts(user);
    return `Seed Executed!`;
  }


  private async deleteTables() {
    
    await this.productServices.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( user => {

      // we are going to encrypt the user's password
      user.password = bcrypt.hashSync(user.password,10);

      // this perepares the user. This is not saving on the database. if like prepare the base structure of user
      users.push( this.userRepository.create(user) );
    });

    const dbUsers = await this.userRepository.save(seedUsers); 

    return dbUsers[0];

  }

  private async insertNewProducts(user: User) {
    await this.productServices.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push(this.productServices.create(product,user));
    });

    await Promise.all(insertPromises);


    return true;
  }

}
