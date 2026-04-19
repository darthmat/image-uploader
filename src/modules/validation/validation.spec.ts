import { ValidationError } from '@/utils/errors.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeFile } from '../storage/storage.fake.js';
import { ImageValidatorConfig } from './validation.interface.js';
import { ImageValidationService } from './validation.service.js';

describe('ImageValidator', () => {
  const defaultConfig: ImageValidatorConfig = {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxDimension: 10000,
  };

  let validator: ImageValidationService;

  beforeEach(() => {
    validator = new ImageValidationService(defaultConfig);
  });

  describe('mimetype validation', () => {
    it.each(['image/jpeg', 'image/png', 'image/webp'])(
      'should pass for allowed mimetype: %s',
      (mimetype) => {
        expect(() => {
          validator.validate(makeFile({ mimetype }), 800, 600, 'My Image');
        }).not.toThrow();
      },
    );

    it('should throw for unsupported mimetype', () => {
      expect(() => {
        validator.validate(
          makeFile({ mimetype: 'image/gif' }),
          800,
          600,
          'My Image',
        );
      }).toThrow(ValidationError);
    });
  });

  describe('dimensions validation', () => {
    it('should pass for valid dimensions', () => {
      expect(() => {
        validator.validate(makeFile(), 800, 600, 'My Image');
      }).not.toThrow();
    });

    it.each([
      [NaN, 600],
      [800, NaN],
      [0, 600],
      [800, 0],
      [-1, 600],
      [800, -1],
    ])('should throw for invalid dimensions: %s x %s', (width, height) => {
      expect(() => {
        validator.validate(makeFile(), width, height, 'My Image');
      }).toThrow(ValidationError);
    });

    it('should throw when width exceeds maxDimension', () => {
      expect(() => {
        validator.validate(makeFile(), 10001, 600, 'My Image');
      }).toThrow(ValidationError);
    });

    it('should throw when height exceeds maxDimension', () => {
      expect(() => {
        validator.validate(makeFile(), 800, 10001, 'My Image');
      }).toThrow(ValidationError);
    });

    it('should pass for max allowed dimensions', () => {
      expect(() => {
        validator.validate(makeFile(), 10000, 10000, 'My Image');
      }).not.toThrow();
    });
  });

  describe('title validation', () => {
    it('should pass for valid title', () => {
      expect(() => {
        validator.validate(makeFile(), 800, 600, 'My Image');
      }).not.toThrow();
    });

    it('should throw for empty title', () => {
      expect(() => {
        validator.validate(makeFile(), 800, 600, '');
      }).toThrow(ValidationError);
    });

    it('should throw for whitespace-only title', () => {
      expect(() => {
        validator.validate(makeFile(), 800, 600, '   ');
      }).toThrow(ValidationError);
    });
  });
});
