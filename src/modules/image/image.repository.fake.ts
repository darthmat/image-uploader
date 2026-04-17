import { vitest } from 'vitest';
import { IImageRepository } from './image.interface.js';
import { Image, ImageData } from './image.model.js';

export class FakeImageRepository implements IImageRepository {
  private readonly images = new Map<string, ImageData>();

  getImage = vitest.fn<IImageRepository['getImage']>(async (id) => {
    const image = this.images.get(id);

    if (!image) return null;

    return Image.fromPersistence(image);
  });

  getImages(): Promise<Image[]> {
    throw new Error('Method not implemented.');
  }

  saveImage = vitest.fn<IImageRepository['saveImage']>(async (image) => {
    this.images.set(image.id, image.data);
  });
}
