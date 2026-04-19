import { Database } from '@/database/types.js';
import {
  IImageRepository,
  PageSelection,
  PaginatedResult,
} from './image.interface.js';
import { Image } from './image.model.js';

export class ImageRepository implements IImageRepository {
  constructor(private readonly db: Database) {}

  async getImages(
    { offset, limit }: PageSelection = {},
    title?: string,
  ): Promise<PaginatedResult<Image>> {
    let query = this.db.selectFrom('image');

    if (title) {
      query = query.where('title', 'like', '%title%');
    }

    const queryWithoutPagination = query;

    if (offset !== undefined) {
      query = query.offset(offset);
    }

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const [images, countResult] = await Promise.all([
      query.selectAll().execute(),
      queryWithoutPagination
        .select(({ fn }) => fn.countAll<string>().as('count'))
        .executeTakeFirstOrThrow(),
    ]);

    return {
      data: images.map((image) =>
        Image.fromPersistence({
          id: image.id,
          title: image.title,
          url: new URL(image.url),
          height: image.height,
          width: image.width,
          type: image.type,
          size: image.size,
          createdAt: image.created_at,
        }),
      ),
      total: Number(countResult.count),
      offset,
      limit,
    };
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
