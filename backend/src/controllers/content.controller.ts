import type { Request, Response } from 'express';
import { listContentQuerySchema } from '../schemas/content.schema.js';
import * as ContentModel from '../models/content.model.js';
import { HttpError } from '../utils/httpError.js';

export async function listContent(req: Request, res: Response) {
  const filters = listContentQuerySchema.parse(req.query);
  const items = await ContentModel.listContent(filters);
  res.json(items);
}

export async function getContent(req: Request, res: Response) {
  const item = await ContentModel.getContentById(req.params.id);
  if (!item) throw HttpError.notFound('Content item not found');
  res.json(item);
}
