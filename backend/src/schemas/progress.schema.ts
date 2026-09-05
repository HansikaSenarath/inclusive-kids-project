import { z } from 'zod';

export const listProgressQuerySchema = z.object({
  child_id: z.string().uuid().optional(),
});

export const createProgressSchema = z.object({
  child_id: z.string().uuid(),
  content_id: z.string().uuid(),
  completed: z.boolean().default(false),
  score: z.number().int().min(0).max(1000).default(0),
  stars: z.number().int().min(0).max(3).default(0),
});

export type ListProgressQuery = z.infer<typeof listProgressQuerySchema>;
export type CreateProgressInput = z.infer<typeof createProgressSchema>;
