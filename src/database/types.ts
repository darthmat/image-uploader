/* eslint-disable @typescript-eslint/naming-convention */
import { Kysely, Generated } from 'kysely';

export type Database = Kysely<ImageUploaderDatabaseTables>;

export interface ImageUploaderDatabaseTables {
  image: ImageTable;
}

interface ImageTable {
  id: string;
  title: string;
  url: URL;
  height: number;
  width: number;
  type: string;
  size: number;
  created_at: Generated<Date>;
}
