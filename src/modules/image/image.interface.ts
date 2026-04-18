import { ImageDTO } from './image.dto.js';
import { Image } from './image.model.js';

export interface IImageService {
  getImages(): Promise<ImageDTO[]>;
  getImage(id: string): Promise<ImageDTO | null>;
  saveImage(
    file: Express.Multer.File,
    title: string,
    dimensions: { width: number; height: number },
  ): Promise<void>;
}

export interface IImageRepository {
  getImages(): Promise<Image[]>;
  getImage(id: string): Promise<Image | null>;
  saveImage(image: Image): Promise<void>;
}
