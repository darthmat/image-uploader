import { Migrator } from 'kysely';
import { createDatabase } from './db.js';
import { GameAggregatorMigrationProvider } from './migrations/index.js';
import { dbConfig } from '@/config.js';

await using db = createDatabase(dbConfig);

const migrator = new Migrator({
  db,
  provider: new GameAggregatorMigrationProvider(),
});

const { error, results } = await migrator.migrateToLatest();

results?.forEach((it) => {
  if (it.status === 'Success') {
    console.log(`Migration '${it.migrationName}' was executed successfully.`);
  } else if (it.status === 'Error') {
    console.error(`Failed to execute migration '${it.migrationName}.'`);
  }
});

if (error) {
  console.error('Failed to migrate.');
  console.error(error);
  process.exit(1);
}

if (!results?.length) {
  console.log('No migrations run.');
}
