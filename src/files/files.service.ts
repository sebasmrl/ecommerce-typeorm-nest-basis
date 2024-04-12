import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {
  create() {
    return 'This action adds a new file';
  }


  getUrlProductImage(imageName: string){
    const path = join(__dirname, '../../static/products', imageName);
    if(!existsSync(path)) 
      throw new BadRequestException(`No se encontró la imagen con el nombre: ${imageName}`);
    return path;

  }
}
