import express from 'express';
import { readFileSync } from 'fs';
import { serve, setup } from 'swagger-ui-express';
import { RegisterRoutes } from './build/tsoa/routes.js';
import { config, dbConfig } from './config.js';
import { container } from './container.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './utils/errors.js';

const _dirname = dirname(fileURLToPath(import.meta.url));

async function start() {
  await container(dbConfig, config);

  const app = express();

  app.use(express.json());

  app.get('/docs/swagger.json', (_req, res) => {
    const swaggerDoc = JSON.parse(
      readFileSync(join(_dirname, 'build/tsoa/swagger.json'), 'utf-8'),
    ) as Record<string, unknown>;

    res.json(swaggerDoc);
  });

  app.use(
    '/docs',
    serve,
    setup(undefined, {
      swaggerOptions: {
        url: '/docs/swagger.json',
        showRequestHeaders: true,
        jsonEditor: true,
        docExpansion: 'none',
      },
    }),
  );

  app.use('/files', express.static('uploads'));

  RegisterRoutes(app);

  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`Image uploader app listening on ${config.appUrl}`);
  });
}

await start();
