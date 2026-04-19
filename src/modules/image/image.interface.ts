import { ImageDTO } from './image.dto.js';
import { Image } from './image.model.js';

export interface IImageService {
  getImages(
    page: PageSelection | undefined,
    title?: string,
  ): Promise<PaginatedResult<ImageDTO>>;
  getImage(id: string): Promise<ImageDTO | null>;
  saveImage(
    file: Express.Multer.File,
    title: string,
    dimensions: { width: number; height: number },
  ): Promise<void>;
}

export interface IImageRepository {
  getImages(
    page: PageSelection | undefined,
    title?: string,
  ): Promise<PaginatedResult<Image>>;
  getImage(id: string): Promise<Image | null>;
  saveImage(image: Image): Promise<void>;
}

export interface PageSelection {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  offset?: number;
  limit?: number;
}
