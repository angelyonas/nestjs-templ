import { existsSync } from 'fs';
import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FilesService {
  getProductImage(filename: string) {
    const path = join(__dirname, '../../static/products', filename);
    if (!existsSync(path))
      throw new NotFoundException(`Image ${filename} not found`);

    return path;
  }
}
