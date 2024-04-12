import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'

import { Product, ProductImage } from './entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly datasource: DataSource, //todo lo relacionado a la conexion a DB
    private readonly configService: ConfigService
  ) { }



  async create(createProductDto: CreateProductDto) {
    try {
    
      const { images=[], ...restDetailsProduct } = createProductDto;

      // ejecucion de BeforeInsertEntity
      const product = this.productRepository.create({
        ...restDetailsProduct,
        images: images.map( imgUrl => this.productImageRepository.create({ url: imgUrl}) )
      });
      await this.productRepository.save(product);
      return  {...product, images: images }  //product; images in line 28

    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit, //tomar
      skip: offset,//saltar
      //TODO: Relaciones
      relations: {
        images:true
      }
    });
    return products.map( product => ({
        ...product, 
        images: product.images.map( img => `${this.configService.get('HOST_API')}/files/product/${img.url}`)
    }));
  }



  async findOne(searchTerm: string) {

    let product: Product;

    if (isUUID(searchTerm)) {
      product = await this.productRepository.findOneBy({ id: searchTerm }); //Funciona con eager:true
    } else {

      //QUERYBUILDER
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug=:slug`,
          { title: searchTerm.toUpperCase(), slug: searchTerm.toLowerCase() })
          .leftJoinAndSelect('prod.images','prodImages') //punto del leftJoin, alias (en caso de querer hacer otro join abajo)
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Producto con id : ${searchTerm} no encontrado`);
    return product;
  }


  async findOnePlain(searchTerm:string){
    const { images=[], ...restProduct} = await this.findOne(searchTerm);
    return {
       ...restProduct,
       images: images.map( img=>  `${this.configService.get('HOST_API')}/files/product/${img.url}`)
    }
  }



  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...dataToUpdate }= updateProductDto;

    const product = await this.productRepository.preload({ id, ...dataToUpdate });
    if (!product) throw new NotFoundException(`Producto con id: ${id} no existe en DB`);

    //Create QueryRunner
    //definir los procedimientos, solo hay commit si todos se cumplen, sino rollback
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect(); //conectarse a db
    await queryRunner.startTransaction();

    try{
      if(images) { 
        await queryRunner.manager.delete(ProductImage, { product: {id: id} })
        product.images = images.map( img => this.productImageRepository.create({url:img}));
      }

      //return await this.productRepository.save(product);
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release(); //cerrar queryRunner

      return this.findOnePlain(id); //reutilizacion
      
    }catch(error){
      await queryRunner.rollbackTransaction();
      await queryRunner.release(); 
      this.handleDBExceptions(error);

    }
  }


  async remove(id: string) {
    //puede hacerse mediante transaccion idealmente
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }


  //Handler methods
  private handleDBExceptions(error: any) {
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error?.detail);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }

  /** 
  *@autor 'Sebastian Morales'
  *@description 'Use this method only dev environment for clear DB and insert new SEED
  */
  async deleteAllProductsForSeed() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
                  .delete()
                  .where({})
                  .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


}


/*   async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images:[]
    });

    if (!product) throw new NotFoundException(`Producto con id: ${id} no existe en DB`);

    try{
      return await this.productRepository.save(product);
    }catch(error){
      this.handleDBExceptions(error);

    }
  } */