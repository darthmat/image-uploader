/* eslint-disable @typescript-eslint/naming-convention */
import { Kysely, Generated } from 'kysely';

export type Database = Kysely<ImageUploaderDatabaseTables>;

export interface ImageUploaderDatabaseTables {
  image: ImageTable;
}

interface ImageTable {
  id: Generated<number>;
  title: string;
  width: number;
  height: number;
  url: string;
  created_at: Generated<Date>;
}
