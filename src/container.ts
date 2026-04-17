import { Config, DbConfig } from './config.js';
import { HealthzController } from './modules/healthz/healthz.controller.js';
import { bindAll } from './tsoa.ioc.js';

export async function container(config: Config) {
  const healthzController = new HealthzController();

  bindAll([healthzController]);
}
