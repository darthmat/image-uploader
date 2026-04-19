export interface IImageValidationService {
  validate(
    file: Express.Multer.File,
    width: number,
    height: number,
    title: string,
  ): void;
}

export interface ImageValidatorConfig {
  allowedMimeTypes: string[];
  maxDimension: number;
}
