import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      // ejecucion de BeforeInsertEntity
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;

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
    });
    return products;
  }

  async findOne(searchTerm: string) {

    let product: Product;

    if (isUUID(searchTerm)) {
      product = await this.productRepository.findOneBy({ id: searchTerm });
    } else {
      //QUERYBUILDER
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug=:slug`,
          { title: searchTerm.toUpperCase(), slug: searchTerm.toLowerCase() })
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Producto con id : ${searchTerm} no encontrado`);
    return product;
  }


  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) throw new NotFoundException(`Producto con id: ${id} no existe en DB`);

    try{
      return await this.productRepository.save(product);
    }catch(error){
      this.handleDBExceptions(error);

    }
  }


  async remove(id: string) {
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


}
