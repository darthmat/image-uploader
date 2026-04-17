import { Migration, sql } from 'kysely';

/**
 * Initial migration for settings up the database.
 */
export const initialMigration: Migration = {
  async up(db) {
    await db.schema
      .createTable('image')
      .addColumn('id', 'uuid', (col) => col.primaryKey())
      .addColumn('title', 'varchar', (col) => col.notNull())
      .addColumn('url', 'varchar', (col) => col.notNull())
      .addColumn('height', 'varchar', (col) => col.notNull())
      .addColumn('width', 'varchar', (col) => col.notNull())
      .addColumn('type', 'varchar', (col) => col.notNull())
      .addColumn('size', 'integer', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .execute();

    await db.schema
      .createIndex('image_query_idx')
      .on('image')
      .column('query')
      .execute();
  },
  async down(db) {
    await db.schema.dropTable('image').execute();
  },
};
