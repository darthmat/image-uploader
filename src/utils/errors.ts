import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

export class ValidationError extends Error {
  constructor(readonly error: string) {
    super(`Validation failed: ${error}`);
    this.name = 'ValidationError';
  }
}

export class ImageAlreadyExistsError extends Error {
  constructor(title: string) {
    super(`Image with title "${title}" already exists`);
  }
}

export class InternalError extends Error {
  constructor(cause?: unknown) {
    super('An internal error occurred.');
    this.name = 'InternalError';
    this.cause = cause;
  }
}

export class EntityNotFoundError extends Error {
  constructor(message: string);
  constructor(entityName: string, entityId: number | string);
  constructor(
    readonly messageOrEntityName: string,
    readonly entityId?: number | string,
  ) {
    super(
      entityId === undefined
        ? messageOrEntityName
        : `Entity ${messageOrEntityName} with ID ${entityId} not found.`,
    );
    this.name = 'EntityNotFoundError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ValidateError) {
    res.status(422).json({
      message: 'Validation failed',
      details: err.fields,
    });
    return;
  }

  if (err instanceof ImageAlreadyExistsError) {
    res.status(409).json({ message: err.message });
    return;
  }

  if (err instanceof EntityNotFoundError) {
    res.status(404).json({ message: err.message });
    return;
  }

  if (err instanceof InternalError) {
    res.status(500).json({ message: err.message });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: 'An unexpected error occurred.' });
}
