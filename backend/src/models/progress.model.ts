import { query } from '../config/db.js';
import type { ProgressLog } from '../types/models.js';
import type { CreateProgressInput, ListProgressQuery } from '../schemas/progress.schema.js';

export async function listProgress(filters: ListProgressQuery): Promise<ProgressLog[]> {
  if (filters.child_id) {
    const result = await query<ProgressLog>(
      'SELECT * FROM progress_logs WHERE child_id = $1 ORDER BY created_at DESC',
      [filters.child_id]
    );
    return result.rows;
  }

  const result = await query<ProgressLog>(
    'SELECT * FROM progress_logs ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function createProgress(input: CreateProgressInput): Promise<ProgressLog> {
  const result = await query<ProgressLog>(
    `INSERT INTO progress_logs (child_id, content_id, completed, score, stars)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [input.child_id, input.content_id, input.completed, input.score, input.stars]
  );
  return result.rows[0];
}
