import { query } from '../config/db.js';
import type { AACBoard } from '../types/models.js';
import type {
  CreateAacBoardInput,
  ListAacBoardsQuery,
  UpdateAacBoardInput,
} from '../schemas/aacBoard.schema.js';

export async function listAacBoards(filters: ListAacBoardsQuery): Promise<AACBoard[]> {
  if (filters.child_id) {
    const result = await query<AACBoard>(
      'SELECT * FROM aac_boards WHERE child_id = $1 ORDER BY created_at DESC',
      [filters.child_id]
    );
    return result.rows;
  }

  const result = await query<AACBoard>('SELECT * FROM aac_boards ORDER BY created_at DESC');
  return result.rows;
}

export async function getAacBoardById(id: string): Promise<AACBoard | null> {
  const result = await query<AACBoard>('SELECT * FROM aac_boards WHERE id = $1', [id]);
  return result.rows[0] ?? null;
}

export async function createAacBoard(input: CreateAacBoardInput): Promise<AACBoard> {
  const result = await query<AACBoard>(
    `INSERT INTO aac_boards (child_id, name, symbols)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [input.child_id ?? null, input.name, JSON.stringify(input.symbols)]
  );
  return result.rows[0];
}

export async function updateAacBoard(
  id: string,
  updates: UpdateAacBoardInput
): Promise<AACBoard | null> {
  const existing = await getAacBoardById(id);
  if (!existing) return null;

  const merged = {
    name: updates.name ?? existing.name,
    symbols: updates.symbols ?? existing.symbols,
  };

  const result = await query<AACBoard>(
    `UPDATE aac_boards SET name = $1, symbols = $2 WHERE id = $3 RETURNING *`,
    [merged.name, JSON.stringify(merged.symbols), id]
  );
  return result.rows[0];
}
