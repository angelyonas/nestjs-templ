import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback,
) => {
  const extension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${extension}`;

  callback(null, fileName);
};
