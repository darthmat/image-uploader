import * as fs from 'fs/promises';
import * as path from 'path';
import { IStorageService } from './storage.interface.js';
import { Config } from '@/config.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export class StorageService implements IStorageService {
  constructor(private readonly config: Config) {}

  async save(filename: string, buffer: Buffer): Promise<string> {
    const filePath = path.join(UPLOADS_DIR, filename);

    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return `${this.config.appUrl}/files/${filename}`;
  }
}
