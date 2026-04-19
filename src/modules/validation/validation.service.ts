import { ValidationError } from '@/utils/errors.js';
import {
  IImageValidationService,
  ImageValidatorConfig,
} from './validation.interface.js';

export class ImageValidationService implements IImageValidationService {
  constructor(private readonly config: ImageValidatorConfig) {}

  validate(
    file: Express.Multer.File,
    width: number,
    height: number,
    title: string,
  ): void {
    this.validateFile(file);
    this.validateDimensions(width, height);
    this.validateTitle(title);
  }

  private validateFile(file: Express.Multer.File): void {
    if (!this.config.allowedMimeTypes.includes(file.mimetype)) {
      throw new ValidationError(`Unsupported image format: ${file.mimetype}`);
    }
  }

  private validateDimensions(width: number, height: number): void {
    if (isNaN(width) || isNaN(height)) {
      throw new ValidationError('Width and height must be valid numbers');
    }

    if (width <= 0 || height <= 0) {
      throw new ValidationError('Width and height must be positive numbers');
    }

    if (width > this.config.maxDimension || height > this.config.maxDimension) {
      throw new ValidationError(
        `Dimensions cannot exceed ${this.config.maxDimension}px`,
      );
    }
  }

  private validateTitle(title: string): void {
    if (!title.trim()) {
      throw new ValidationError('Title cannot be empty');
    }
  }
}
