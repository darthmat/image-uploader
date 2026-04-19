import { withDatabase } from '@/database/__utils__.js';
import { Database } from '@/database/types.js';
import { describe, expect, it } from 'vitest';
import { createFakeImage } from '../__utils__.js';
import { ImageRepository } from '../image.repository.js';

describe('ImageRepository', () => {
  let db: Database;
  let repository: ImageRepository;

  withDatabase((_db) => {
    db = _db;
    repository = new ImageRepository(_db);
  });

  describe('getImage', () => {
    it('should return null when image does not exist', async () => {
      const result = await repository.getImageById(crypto.randomUUID());

      expect(result).toBeNull();
    });

    it('should return image by id', async () => {
      const fakeImage = createFakeImage({ title: 'image' });
      await repository.saveImage(fakeImage);

      const result = await repository.getImageById(fakeImage.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(fakeImage.id);
      expect(result?.title).toBe(fakeImage.title);
    });

    it('should return image with all fields', async () => {
      const fakeImage = createFakeImage({
        url: new URL('https://cdn.example.com/image.jpg'),
        width: 1920,
        height: 1080,
        type: 'image/jpeg',
        size: 204800,
      });
      await repository.saveImage(fakeImage);

      const result = await repository.getImageById(fakeImage.id);

      expect(result?.url.toString()).toBe(fakeImage.url.toString());
      expect(result?.width).toBe(fakeImage.width);
      expect(result?.height).toBe(fakeImage.height);
      expect(result?.type).toBe(fakeImage.type);
      expect(result?.size).toBe(fakeImage.size);
    });
  });

  describe('saveImage', () => {
    it('should save image to database', async () => {
      const fakeImage = createFakeImage();

      await repository.saveImage(fakeImage);

      const result = await repository.getImageById(fakeImage.id);

      expect(result).not.toBeNull();
    });
  });

  describe('getImages', () => {
    it('should return empty result when table is empty', async () => {
      const result = await repository.getImages();

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should return all images', async () => {
      await repository.saveImage(createFakeImage());
      await repository.saveImage(createFakeImage());
      await repository.saveImage(createFakeImage());

      const result = await repository.getImages();

      expect(result.total).toBe(3);
      expect(result.data).toHaveLength(3);
    });

    it('should filter images by title', async () => {
      await repository.saveImage(createFakeImage({ title: 'image-1' }));
      await repository.saveImage(createFakeImage({ title: 'image-2' }));

      const result = await repository.getImages({}, 'image-1');

      expect(result.total).toBe(1);
      expect(result.data[0]?.title).toBe('image-1');
    });

    it('should return empty when title filter matches nothing', async () => {
      await repository.saveImage(createFakeImage({ title: 'image-1' }));

      const result = await repository.getImages({}, 'image-2');

      expect(result.total).toBe(0);
      expect(result.data).toHaveLength(0);
    });

    it('should apply limit to query call', async () => {
      await saveImages(5);

      const result = await repository.getImages({ limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(5);
      expect(result.limit).toBe(2);
    });

    it('should apply offset to query call', async () => {
      await saveImages(5);

      const all = await repository.getImages();
      const paged = await repository.getImages({ offset: 2 });

      expect(paged.data).toHaveLength(3);
      expect(paged.data[0]?.id).toBe(all.data[2]?.id);
      expect(paged.offset).toBe(2);
    });
  });

  async function saveImages(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await repository.saveImage(createFakeImage());
    }
  }
});
