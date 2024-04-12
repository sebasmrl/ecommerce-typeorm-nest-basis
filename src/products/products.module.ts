import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, ProductImage } from './entities';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    TypeOrmModule.forFeature([ Product, ProductImage ]), //todas las entidades que el modulo define
    ConfigModule,
  ],
  exports:[ProductsService]
})
export class ProductsModule {}
