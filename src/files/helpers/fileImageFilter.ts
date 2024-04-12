export const fileImageFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    console.log(file)
    if(!file) callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validFileExtension = ['jpg', 'png', 'jpeg']

    if(validFileExtension.includes(fileExtension)) return callback(null, true);

    callback(null, false);
}