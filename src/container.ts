import { Config, DbConfig } from './config.js';
import { createDatabase } from './database/db.js';
import { HealthzController } from './modules/healthz/healthz.controller.js';
import { ImagesController } from './modules/image/image.controller.js';
import { ImageRepository } from './modules/image/image.repository.js';
import { ImageService } from './modules/image/image.service.js';
import { StorageService } from './modules/storage/storage.service.js';
import { ImageValidationService } from './modules/validation/validation.service.js';
import { bindAll } from './tsoa.ioc.js';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const MAX_IMAGE_DIMENSION = 10000;

export async function container(dbConfig: DbConfig, config: Config) {
  const db = createDatabase(dbConfig);

  const imageRepository = new ImageRepository(db);
  const storageService = new StorageService(config);
  const imageService = new ImageService(imageRepository, storageService);
  const imageValidationService = new ImageValidationService({
    allowedMimeTypes: ALLOWED_IMAGE_TYPES,
    maxDimension: MAX_IMAGE_DIMENSION,
  });

  const healthzController = new HealthzController();
  const imageController = new ImagesController(
    imageService,
    imageValidationService,
  );

  bindAll([healthzController, imageController]);
}
