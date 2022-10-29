import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor() {}

  async saveMulterImage(
    userId: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const IMAGE_WIDTH = 512;
    const filename = `${userId}.${Date.now()}.${image.originalname}`;
    const dir = join(__dirname, '../../public/uploads/images/small/');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    await sharp(image.buffer)
      .resize({ height: IMAGE_WIDTH, width: IMAGE_WIDTH, position: 'center' })
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toFile(`${dir}${filename}`);
    return filename;
  }
}
