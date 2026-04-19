import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import assert from 'assert';
import { Migrator, sql } from 'kysely';
import { afterAll, afterEach, beforeAll, beforeEach, vitest } from 'vitest';
import { createDatabase } from './db.js';
import { ImageUploaderMigrationProvider } from './migrations/index.js';
import { Database } from './types.js';

/**
 * Spins up a MySQL container and runs the provided callback with a fresh database
 * in `beforeEach` and destroys the connection in `afterEach`.
 */
export function withDatabase(
  cb: (db: Database, invalidDb: Database) => void | Promise<void>,
): void {
  vitest.setConfig({ testTimeout: 60000, hookTimeout: 60000 });

  let postgresContainer: StartedPostgreSqlContainer;
  let db: Database;
  let invalidDb: Database;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:latest')
      .withDatabase('name_should_not_matter')
      .withTmpFs({
        '/var/lib/postgresql': 'rw',
      })
      .start();

    db = createDatabase({
      host: postgresContainer.getHost(),
      port: postgresContainer.getPort(),
      user: postgresContainer.getUsername(),
      password: postgresContainer.getPassword(),
      database: postgresContainer.getDatabase(),
    });

    invalidDb = createDatabase({
      host: postgresContainer.getHost(),
      port: postgresContainer.getPort(),
      user: postgresContainer.getUsername(),
      password: 'empty',
      database: postgresContainer.getDatabase(),
    });
  });

  afterAll(async () => {
    await db.destroy();
    await postgresContainer.stop();
  });

  beforeEach(async () => {
    const migrator = new Migrator({
      db,
      provider: new ImageUploaderMigrationProvider(),
    });

    const result = await migrator.migrateToLatest();
    if (result.error) {
      assert(result.error instanceof Error);
      throw result.error;
    }

    await cb(db, invalidDb);
  });

  afterEach(async () => {
    await sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`.execute(db);
  });
}
