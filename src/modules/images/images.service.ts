import { ImageDTO } from './images.dto.js';
import { IImageRepository, IImageService } from './images.interface.js';

export class ImageService implements IImageService {
  constructor(private readonly imageRepository: IImageRepository) {}

  getImages(): Promise<ImageDTO[]> {
    throw new Error('Method not implemented.');
  }
  getImage(id: string): Promise<ImageDTO> {
    throw new Error('Method not implemented.');
  }
  saveImage(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
