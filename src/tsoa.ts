import { type Config, generateSpecAndRoutes } from '@tsoa/cli';

await generateSpecAndRoutes({
  configuration: generateTsoaConfig(),
});

function generateTsoaConfig(): Config {
  return {
    entryFile: `src/index.ts`,
    noImplicitAdditionalProperties: 'throw-on-extras' as const,
    controllerPathGlobs: [`src/modules/*/*.controller.ts`],
    spec: {
      outputDirectory: `src/build/tsoa`,
      specVersion: 3,
      version: '1',
    },
    routes: {
      iocModule: 'src/tsoa.ioc.ts',
      routesDir: `src/build/tsoa`,
      bodyCoercion: true,
      middleware: 'express',
      esm: true,
      noWriteIfUnchanged: true,
    },
    compilerOptions: {
      baseUrl: '.',
      paths: {
        '@/*': ['src/*'],
      },
    },
  };
}
