import assert from 'assert';
import type { Controller, Newable } from 'tsoa';

type Constructor = new (...args: unknown[]) => Controller;

const registry = new Map<Constructor, Controller>();

export const iocContainer = {
  get(controllerConstructor: Newable<Controller>): Promise<Controller> {
    const controller = registry.get(controllerConstructor);

    assert(
      controller,
      `Controller ${controllerConstructor.name} not found in ioc container. Did you forget to register it?`,
    );

    return Promise.resolve(controller);
  },
};

export function bindAll(instances: Controller[]) {
  instances.forEach((i) => registry.set(i.constructor as Constructor, i));
}
