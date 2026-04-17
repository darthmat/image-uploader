import express from 'express';
import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './build/tsoa/routes.js';
import { config, dbConfig } from './config.js';
import { container } from './container.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));

async function start() {
  await container(config, dbConfig);

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
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/docs/swagger.json',
        showRequestHeaders: true,
        jsonEditor: true,
        docExpansion: 'none',
      },
    }),
  );

  RegisterRoutes(app);

  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
}

await start();
