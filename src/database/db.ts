import { Kysely } from 'kysely';
import { createKyselyDialect } from './dialect.js';
import { ImageUploaderDatabaseTables } from './types.js';
import { DbConfig } from '@/config.js';

export function createDatabase(
  dbConfig: DbConfig,
): Kysely<ImageUploaderDatabaseTables> {
  return new Kysely<ImageUploaderDatabaseTables>({
    dialect: createKyselyDialect(dbConfig),
    log: ['error'],
  });
}
