import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs/promises';
import sharp from 'sharp';

@Injectable()
export class ImageOptimizationService {
  private readonly outputDir = join(__dirname, '..', '..', '..', 'uploads', 'products');

  async ensureOutputDir(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (_) {}
  }

  async processAndSave(buffer: Buffer, baseName: string): Promise<string> {
    try {
      await this.ensureOutputDir();
      const fileName = `${baseName}.webp`;
      const outputPath = join(this.outputDir, fileName);

      const image = sharp(buffer, { failOnError: false });
      const metadata = await image.metadata();

      const targetWidth = 1600; // разумный максимум
      const width = metadata.width && metadata.width > targetWidth ? targetWidth : metadata.width;

      const pipeline = image
        .rotate()
        .resize({ width: width || targetWidth, withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 });

      await pipeline.toFile(outputPath);
      return `/uploads/products/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException('Image processing failed');
    }
  }

  async processMany(files: Express.Multer.File[]): Promise<string[]> {
    const tasks = files.map((file) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      return this.processAndSave(file.buffer, unique);
    });
    return Promise.all(tasks);
  }
}
