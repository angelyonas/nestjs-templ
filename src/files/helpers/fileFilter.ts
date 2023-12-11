import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback,
) => {
  console.log(file);

  const extension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(extension)) {
    return callback(null, true);
  }

  callback(new BadRequestException('Invalid image format'), false);
};
