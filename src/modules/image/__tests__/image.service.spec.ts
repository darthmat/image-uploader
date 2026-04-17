import { beforeEach, describe, expect, it } from 'vitest';
import { IImageService } from '../image.interface.js';
import { ImageService } from '../image.service.js';
import { FakeImageRepository } from '../image.repository.fake.js';
import { Image } from '../image.model.js';

describe('ImageService', () => {
  let imageService: IImageService;
  let imageRepository: FakeImageRepository;

  beforeEach(() => {
    imageRepository = new FakeImageRepository();
    imageService = new ImageService(imageRepository);
  });

  describe('getImage', () => {
    it('should return null when image does not exist', async () => {
      const result = await imageService.getImage('non-existent-id');

      expect(result).toBeNull();
      expect(imageRepository.getImage).toHaveBeenCalledWith('non-existent-id');
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
      expect(imageRepository.getImage).toHaveBeenCalledWith('test-id');
    });

    it('should call repository getImage with the provided id', async () => {
      await imageService.getImage('some-id');

      expect(imageRepository.getImage).toHaveBeenCalledOnce();
      expect(imageRepository.getImage).toHaveBeenCalledWith('some-id');
    });
  });
});
