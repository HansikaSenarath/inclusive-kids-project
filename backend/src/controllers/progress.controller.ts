import type { Request, Response } from 'express';
import { createProgressSchema, listProgressQuerySchema } from '../schemas/progress.schema.js';
import * as ProgressModel from '../models/progress.model.js';
import { HttpError } from '../utils/httpError.js';

interface PgError {
  code?: string;
}

export async function listProgress(req: Request, res: Response) {
  const filters = listProgressQuerySchema.parse(req.query);
  const logs = await ProgressModel.listProgress(filters);
  res.json(logs);
}

export async function createProgress(req: Request, res: Response) {
  const input = createProgressSchema.parse(req.body);
  try {
    const log = await ProgressModel.createProgress(input);
    res.status(201).json(log);
  } catch (error) {
    if ((error as PgError).code === '23503') {
      throw HttpError.badRequest('child_id or content_id does not reference an existing record');
    }
    throw error;
  }
}
