import { Database } from '@/database/types.js';
import { IImageRepository } from './image.interface.js';
import { Image } from './image.model.js';

export class ImageRepository implements IImageRepository {
  constructor(private readonly db: Database) {}

  async getImages(): Promise<Image[]> {
    throw new Error('Method not implemented.');
  }

  async getImage(id: string): Promise<Image | null> {
    const image = await this.db
      .selectFrom('image')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!image) return null;

    return Image.fromPersistence({
      id: image.id,
      title: image.title,
      url: new URL(image.url),
      height: image.height,
      width: image.width,
      type: image.type,
      size: image.size,
      createdAt: image.created_at,
    });
  }

  async saveImage(image: Image): Promise<void> {
    await this.db
      .insertInto('image')
      .values({
        id: image.id,
        title: image.title,
        url: image.url.toString(),
        height: image.height,
        width: image.width,
        type: image.type,
        size: image.size,
      })
      .execute();
  }
}
