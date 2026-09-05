import { z } from 'zod';

export const listContentQuerySchema = z.object({
  type: z.enum(['story', 'quiz', 'game']).optional(),
  category: z.string().trim().min(1).optional(),
  age: z.coerce.number().int().min(0).max(120).optional(),
});

export type ListContentQuery = z.infer<typeof listContentQuerySchema>;
