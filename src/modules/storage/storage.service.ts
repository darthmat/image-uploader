import * as fs from 'fs/promises';
import * as path from 'path';
import { IStorageService } from './storage.interface.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export class StorageService implements IStorageService {
  async save(filename: string, buffer: Buffer): Promise<string> {
    const filePath = path.join(UPLOADS_DIR, filename);

    await fs.mkdir(UPLOADS_DIR);
    await fs.writeFile(filePath, buffer);

    return filePath;
  }
}
