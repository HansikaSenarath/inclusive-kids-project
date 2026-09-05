import { z } from 'zod';

const aacSymbolSchema = z.object({
  id: z.string(),
  label: z.string(),
  emoji: z.string(),
  category: z.string(),
});

export const listAacBoardsQuerySchema = z.object({
  child_id: z.string().uuid().optional(),
});

export const createAacBoardSchema = z.object({
  child_id: z.string().uuid().nullable().optional(),
  name: z.string().trim().min(1).max(80).default('My Board'),
  symbols: z.array(aacSymbolSchema).default([]),
});

export const updateAacBoardSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  symbols: z.array(aacSymbolSchema).optional(),
});

export type ListAacBoardsQuery = z.infer<typeof listAacBoardsQuerySchema>;
export type CreateAacBoardInput = z.infer<typeof createAacBoardSchema>;
export type UpdateAacBoardInput = z.infer<typeof updateAacBoardSchema>;
