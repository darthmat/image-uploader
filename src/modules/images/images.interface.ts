import { ImageDTO } from './images.dto.js';
import { Image } from './images.model.js';

export interface IImageService {
  getImages(): Promise<ImageDTO[]>;
  getImage(id: string): Promise<ImageDTO>;
  saveImage(): Promise<void>;
}

export interface IImageRepository {
  getImages(): Promise<Image[]>;
  getImage(id: string): Promise<Image>;
  saveImage(): Promise<void>;
}
