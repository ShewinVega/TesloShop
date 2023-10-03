import { 
  Injectable, 
  InternalServerErrorException, 
  BadRequestException, 
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ){}

  async create(createProductDto: CreateProductDto) {
    try {

      const { images = [], ...productDetils } = createProductDto;

      // create product instance
      const product = this.productRepository.create({
        ...productDetils,
        images: images.map( image => this.productImageRepository.create({url: image})),
      });

      // create product on database
      await this.productRepository.save(product);

      return {...product, images};

    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return products.map( element => ({
      ...element,
      images: element.images.map( image => image.url)
    }));

  }

  async findOne(term: string) {

    let product: Product;

    if( isUUID(term) ) {
      product = await this.productRepository.findOneBy({id:term});
    }

    if (!isUUID(term)) {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('LOWER(title) =LOWER(:title) or LOWER(slug) =LOWER(:slug)',{
          title: term,
          slug: term,
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }

    if(!product) throw new NotFoundException(`Product with ${term} does not exist!`); 

    return product;

  }

  async findOneImagePlain( term: any ) {

    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map( img => img.url ),
    }

  }

  async update(id: string, updateProductDto: UpdateProductDto) {


    const { images, ...toUpdate } = updateProductDto;


    const product = await this.productRepository.preload({id, ...toUpdate});

    if(!product) throw new NotFoundException(`Product with id: ${id} not found`);

    // create query-runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // we are going to connect to the database;
    await queryRunner.startTransaction(); // we start the transaction services;

    try {
    
      // If there are images from the request, first, we are going to delete the previus images
      if(images) {
        await queryRunner.manager.delete( ProductImage,{ product: id });

        // Second, we are going to save the new images if these exist.
        product.images = images.map( image => this.productImageRepository.create({ url: image }));
      }


      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction(); // complete the transaction
      await queryRunner.release(); // delete the queryRunner services, because we do not need it anymore;

      return this.findOneImagePlain(id);
      // await this.productRepository.save(product);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleError(error);
    }
  }

  async remove(id: string) {
  
    const productExist = await this.findOne(id);

    await this.productRepository.remove(productExist);

    return `Product deleted successfully`;

  }


  private handleError( error: any ) {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpect error, check server logs');

  }


  async deleteAllProducts() {
    
    const query = this.productRepository.createQueryBuilder('product');

    try {
      
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleError(error);
    }


  }

}
