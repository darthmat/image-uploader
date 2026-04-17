import { Config, DbConfig } from './config.js';
import { createDatabase } from './database/db.js';
import { HealthzController } from './modules/healthz/healthz.controller.js';
import { ImagesController } from './modules/images/images.controller.js';
import { ImageRepository } from './modules/images/images.repository.js';
import { ImageService } from './modules/images/images.service.js';
import { bindAll } from './tsoa.ioc.js';

export async function container(config: Config, dbConfig: DbConfig) {
  const db = createDatabase(dbConfig);

  const imageRepository = new ImageRepository(db);
  const imageService = new ImageService(imageRepository);

  const healthzController = new HealthzController();
  const imageController = new ImagesController(imageService);

  bindAll([healthzController, imageController]);
}
