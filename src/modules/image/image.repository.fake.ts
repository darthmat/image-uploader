import { vitest } from 'vitest';
import { IImageRepository, PageSelection } from './image.interface.js';
import { Image, ImageData } from './image.model.js';

export class FakeImageRepository implements IImageRepository {
  private readonly images = new Map<string, ImageData>();

  getImageById = vitest.fn<IImageRepository['getImageById']>(async (id) => {
    const image = this.images.get(id);

    if (!image) return null;

    return Image.fromPersistence(image);
  });

  getImageByTitle = vitest.fn<IImageRepository['getImageByTitle']>(
    async (title) => {
      const image = [...this.images.values()].find((i) => i.title === title);

      if (!image) return null;

      return Image.fromPersistence(image);
    },
  );

  getImages = vitest.fn<IImageRepository['getImages']>(
    async ({ offset, limit }: PageSelection = {}, title?) => {
      const filtered = Array.from(this.images.values())
        .map((image) =>
          Image.fromPersistence({
            id: image.id,
            title: image.title,
            url: new URL(image.url),
            height: image.height,
            width: image.width,
            type: image.type,
            size: image.size,
            createdAt: image.createdAt,
          }),
        )
        .filter((image) => !title || title === image.title);

      const paginated = filtered.slice(
        offset ?? 0,
        limit !== undefined ? (offset ?? 0) + limit : undefined,
      );

      return {
        data: paginated,
        total: filtered.length,
        offset,
        limit,
      };
    },
  );

  saveImage = vitest.fn<IImageRepository['saveImage']>(async (image) => {
    this.images.set(image.id, {
      id: image.id,
      title: image.title,
      url: image.url,
      height: 100,
      width: 200,
      type: '',
      size: 0,
      createdAt: new Date(),
    });
  });
}
