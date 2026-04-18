import type { Multer } from 'multer';
import type { Request, Response } from 'express';

export function processFile(
  upload: Multer,
  request: Request,
  response: Response,
): Promise<void> {
  return new Promise((resolve, reject) => {
    upload.single('file')(request, response, (error: unknown) => {
      if (error) {
        reject(new Error('File upload failed', { cause: error }));
        return null;
      }

      resolve();
    });
  });
}
