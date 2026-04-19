import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IImageService } from '../image.interface.js';
import { ImageService } from '../image.service.js';
import { FakeImageRepository } from '../image.repository.fake.js';
import { Image } from '../image.model.js';
import {
  FakeStorageService,
  makeFile,
} from '@/modules/storage/storage.fake.js';

vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    resize: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue({
      data: Buffer.from('fake-image'),
      info: { format: 'webp', width: 200, height: 150, size: 10 },
    }),
  })),
}));

describe('ImageService', () => {
  let imageService: IImageService;
  let imageRepository: FakeImageRepository;
  let storageService: FakeStorageService;

  beforeEach(() => {
    imageRepository = new FakeImageRepository();
    storageService = new FakeStorageService();
    imageService = new ImageService(imageRepository, storageService);
  });

  describe('getImage', () => {
    it('should return null when image does not exist', async () => {
      const result = await imageService.getImage('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return an ImageDTO when image exists', async () => {
      const mockImage = Image.fromPersistence({
        id: 'test-id',
        title: 'Test Image',
        url: new URL('https://example.com/image.jpg'),
        height: 100,
        width: 200,
        type: '',
        size: 0,
        createdAt: new Date(),
      });

      await imageRepository.saveImage(mockImage);

      const result = await imageService.getImage('test-id');

      expect(result).toEqual({
        id: 'test-id',
        title: 'Test Image',
        url: new URL('https://example.com/image.jpg'),
        height: 100,
        width: 200,
      });
    });
  });

  describe('saveImage', () => {
    it('saves resized buffer to storage with given title', async () => {
      await imageService.saveImage(makeFile(), 'my-image', {
        width: 100,
        height: 100,
      });

      expect(storageService.save).toHaveBeenCalledWith(
        'my-image.webp',
        Buffer.from('fake-image'),
      );
    });
  });

  describe('getImages', () => {
    it('should return empty paginated result when no images exist', async () => {
      const result = await imageService.getImages({});

      expect(result).toEqual({
        data: [],
        total: 0,
        offset: undefined,
        limit: undefined,
      });
    });

    it('should return paginated result with images', async () => {
      const mockImage = Image.fromPersistence({
        id: 'test-id',
        title: 'Test Image',
        url: new URL('https://example.com/image.jpg'),
        height: 100,
        width: 200,
        type: '',
        size: 0,
        createdAt: new Date(),
      });

      await imageRepository.saveImage(mockImage);

      const result = await imageService.getImages({});

      expect(result).toEqual({
        data: [
          {
            id: 'test-id',
            title: 'Test Image',
            url: new URL('https://example.com/image.jpg'),
            height: 100,
            width: 200,
          },
        ],
        total: 1,
        offset: undefined,
        limit: undefined,
      });
    });

    it('should return filtered images with title', async () => {
      const images = [
        Image.fromPersistence({
          id: 'test-id-1',
          title: 'Test Image',
          url: new URL('https://example.com/image.jpg'),
          height: 100,
          width: 200,
          type: '',
          size: 0,
          createdAt: new Date(),
        }),
        Image.fromPersistence({
          id: 'test-id-2',
          title: 'Other Image',
          url: new URL('https://example.com/image2.jpg'),
          height: 100,
          width: 200,
          type: '',
          size: 0,
          createdAt: new Date(),
        }),
      ];

      for (const image of images) {
        await imageRepository.saveImage(image);
      }

      const result = await imageService.getImages({}, 'Test Image');

      expect(result.data).toEqual([
        {
          id: 'test-id-1',
          title: 'Test Image',
          url: new URL('https://example.com/image.jpg'),
          height: 100,
          width: 200,
        },
      ]);
    });

    it('should correctly paginate', async () => {
      const images = Array.from({ length: 5 }, (_, i) =>
        Image.fromPersistence({
          id: `test-id-${i}`,
          title: `Image ${i}`,
          url: new URL(`https://example.com/image${i}.jpg`),
          height: 100,
          width: 200,
          type: '',
          size: 0,
          createdAt: new Date(),
        }),
      );

      for (const image of images) {
        await imageRepository.saveImage(image);
      }

      const result = await imageService.getImages({ offset: 1, limit: 2 });

      expect(result.total).toBe(5);
      expect(result.offset).toBe(1);
      expect(result.limit).toBe(2);
    });
  });
});
