import sharp from 'sharp';
import { IStorageService } from '../storage/storage.interface.js';
import { ImageDTO } from './image.dto.js';
import { IImageRepository, IImageService } from './image.interface.js';
import { Image } from './image.model.js';

export class ImageService implements IImageService {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly storageService: IStorageService,
  ) {}

  async getImages(): Promise<ImageDTO[]> {
    throw new Error('Method not implemented.');
  }

  async getImage(id: string): Promise<ImageDTO | null> {
    const image = await this.imageRepository.getImage(id);

    if (!image) return null;

    return {
      id: image.id,
      title: image.title,
      url: image.url,
      height: image.height,
      width: image.width,
    };
  }

  async saveImage(
    file: Express.Multer.File,
    title: string,
    dimensions: { width: number; height: number },
  ): Promise<void> {
    const buffer = await sharp(file.buffer)
      .resize(dimensions.width, dimensions.height)
      .toBuffer();

    const filename = `${title}.webp`;

    const path = await this.storageService.save(filename, buffer);

    await this.imageRepository.saveImage(
      Image.create({
        title,
        url: new URL(path),
        height: dimensions.height,
        width: dimensions.width,
        type: file.mimetype,
        size: buffer.length,
        createdAt: new Date(),
      }),
    );
  }
}
