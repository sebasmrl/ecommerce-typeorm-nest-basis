import { Controller, Post,  UploadedFile, UseInterceptors, UploadedFiles, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor} from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileImageFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  
  @Get('product/:imageName')
  findProductImage(
    @Param('imageName') imageName:string,
    @Res() res:Response
  ){
    const path = this.filesService.getUrlProductImage(imageName);
    return res.status(200).sendFile(path);
  }


  @Post('product')
  @UseInterceptors( FileInterceptor('file-image', { 
    fileFilter: fileImageFilter,
    limits: {
      fileSize: 3000000, //MB = 3millones
    },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) ) // permite acceder al archivo especifico
  uploadProductImageFile(
    @UploadedFile() file: Express.Multer.File
  ) {
    if(!file) throw new BadRequestException('Agrega una imagen válida a la peticion')

      console.log(file)
      const secureUrl = `${this.configService.get('HOST_API')}/api/files/product/${file.filename}`;
    return {
      fileUploaded: file.originalname,
      secureUrl
    };
  }




  @Post('products')
  @UseInterceptors( FileFieldsInterceptor([
    { name:'imagen1', maxCount:1 },
    { name:'fondo2', maxCount:1 }
  ]) ) 
  uploadProductImageFiles(
    @UploadedFiles() files: {imagen1?:Express.Multer.File, fondo2?: Express.Multer.File}
  ) {
    return files;
  }


}
