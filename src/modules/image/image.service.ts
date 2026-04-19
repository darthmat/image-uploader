import sharp from 'sharp';
import { IStorageService } from '../storage/storage.interface.js';
import { ImageDTO } from './image.dto.js';
import {
  IImageRepository,
  IImageService,
  PageSelection,
  PaginatedResult,
} from './image.interface.js';
import { Image } from './image.model.js';
import { ImageAlreadyExistsError, ValidationError } from '@/utils/errors.js';

export class ImageService implements IImageService {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly storageService: IStorageService,
  ) {}

  async getImages(
    page: PageSelection,
    title?: string,
  ): Promise<PaginatedResult<ImageDTO>> {
    const images = await this.imageRepository.getImages(page, title);

    const imageDTO = images.data.map((image) => {
      return {
        id: image.id,
        title: image.title,
        url: image.url,
        height: image.height,
        width: image.width,
      };
    });

    return {
      data: imageDTO,
      total: images.total,
      offset: images.offset,
      limit: images.limit,
    };
  }

  async getImage(id: string): Promise<ImageDTO | null> {
    const image = await this.imageRepository.getImageById(id);

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
    const image = await this.imageRepository.getImageByTitle(title);

    if (image) {
      throw new ImageAlreadyExistsError('Image already exist');
    }

    const { data: buffer, info } = await sharp(file.buffer)
      .resize(dimensions.width, dimensions.height)
      .toBuffer({ resolveWithObject: true });

    const path = await this.storageService.save(
      `${title}.${info.format}`,
      buffer,
    );

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
