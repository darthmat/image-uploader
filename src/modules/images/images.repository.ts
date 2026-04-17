import { Database } from '@/database/types.js';
import { IImageRepository } from './images.interface.js';
import { Image } from './images.model.js';

export class ImageRepository implements IImageRepository {
  constructor(private readonly db: Database) {}

  getImages(): Promise<Image[]> {
    throw new Error('Method not implemented.');
  }
  getImage(id: string): Promise<Image> {
    throw new Error('Method not implemented.');
  }
  saveImage(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
