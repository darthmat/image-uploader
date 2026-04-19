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
});
