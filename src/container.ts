import { Config, DbConfig } from './config.js';
import { createDatabase } from './database/db.js';
import { HealthzController } from './modules/healthz/healthz.controller.js';
import { ImagesController } from './modules/image/image.controller.js';
import { ImageRepository } from './modules/image/image.repository.js';
import { ImageService } from './modules/image/image.service.js';
import { bindAll } from './tsoa.ioc.js';

export async function container(dbConfig: DbConfig) {
  const db = createDatabase(dbConfig);

  const imageRepository = new ImageRepository(db);
  const imageService = new ImageService(imageRepository);

  const healthzController = new HealthzController();
  const imageController = new ImagesController(imageService);

  bindAll([healthzController, imageController]);
}
