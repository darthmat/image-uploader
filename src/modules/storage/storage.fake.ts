import { vitest } from 'vitest';
import { IStorageService } from './storage.interface.js';

export class FakeStorageService implements IStorageService {
  private readonly files = new Map<string, Buffer>();

  save = vitest.fn<IStorageService['save']>(async (filename, buffer) => {
    const filePath = `http://localhost/fake-uploads/${filename}`;
    this.files.set(filePath, buffer);
    return filePath;
  });
}

export function makeFile(
  overrides?: Partial<Express.Multer.File>,
): Express.Multer.File {
  return {
    buffer: Buffer.from('original'),
    mimetype: 'image/webp',
    originalname: 'test.webp',
    fieldname: 'file',
    encoding: '7bit',
    size: 100,
    ...overrides,
  } as Express.Multer.File;
}
