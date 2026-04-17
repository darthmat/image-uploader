import { ImageDTO } from './image.dto.js';
import { IImageRepository, IImageService } from './image.interface.js';

export class ImageService implements IImageService {
  constructor(private readonly imageRepository: IImageRepository) {}

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

  async saveImage(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
