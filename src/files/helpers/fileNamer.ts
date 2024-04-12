import { v4 as uuid } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    console.log(file)
    if(!file) callback(new Error('File is empty'), false);


    const fileExtension = file.mimetype.split('/')[1]  // image/png
    const newFileName = `${uuid()}.${fileExtension}`;

    callback(null, newFileName); //(error, retorno)
}