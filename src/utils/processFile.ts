import type { Multer } from 'multer';
import type { Request, Response } from 'express';
import { InternalError } from './errors.js';

export function processFile(
  upload: Multer,
  request: Request,
  response: Response,
): Promise<void> {
  return new Promise((resolve, reject) => {
    upload.single('file')(request, response, (error: unknown) => {
      if (error) {
        reject(new InternalError({ cause: error }));
        return null;
      }

      resolve();
    });
  });
}
