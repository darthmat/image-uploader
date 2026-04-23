import { describe, expect, it } from 'vitest';
import { Image } from '../image.model.js';

describe('Image', () => {
  describe('create', () => {
    it('creates image with generated id', () => {
      const image = Image.create({
        title: 'my-image',
        url: new URL('http://localhost/fake-uploads/my-image'),
        width: 200,
        height: 150,
        type: 'image/webp',
        size: 1000,
      });

      expect(image).toBeDefined();
    });

    it('throws validation error when title is too short', () => {
      expect(() =>
        Image.create({
          title: 'ab',
          url: new URL('http://localhost/fake-uploads/ab'),
          width: 200,
          height: 150,
          type: 'image/webp',
          size: 1000,
        }),
      ).toThrow('Title too short');
    });

    it('throws validation error when title is too long', () => {
      expect(() =>
        Image.create({
          title: 'a'.repeat(256),
          url: new URL('http://localhost/fake-uploads/ab'),
          width: 200,
          height: 150,
          type: 'image/webp',
          size: 1000,
        }),
      ).toThrow('Title too long');
    });
  });
});
