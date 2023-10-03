import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {
  

  constructor(
    private readonly productServices: ProductsService,
  ){}

  async runSeed() {
    this.insertNewProducts();
    return `Seed Executed!`;
  }


  private async insertNewProducts() {
    await this.productServices.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push(this.productServices.create(product));
    });

    await Promise.all(insertPromises);


    return true;
  }

}
