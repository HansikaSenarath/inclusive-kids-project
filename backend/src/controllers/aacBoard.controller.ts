import type { Request, Response } from 'express';
import {
  createAacBoardSchema,
  listAacBoardsQuerySchema,
  updateAacBoardSchema,
} from '../schemas/aacBoard.schema.js';
import * as AacBoardModel from '../models/aacBoard.model.js';
import { HttpError } from '../utils/httpError.js';

export async function listAacBoards(req: Request, res: Response) {
  const filters = listAacBoardsQuerySchema.parse(req.query);
  const boards = await AacBoardModel.listAacBoards(filters);
  res.json(boards);
}

export async function createAacBoard(req: Request, res: Response) {
  const input = createAacBoardSchema.parse(req.body);
  const board = await AacBoardModel.createAacBoard(input);
  res.status(201).json(board);
}

export async function updateAacBoard(req: Request, res: Response) {
  const input = updateAacBoardSchema.parse(req.body);
  const board = await AacBoardModel.updateAacBoard(req.params.id, input);
  if (!board) throw HttpError.notFound('AAC board not found');
  res.json(board);
}
