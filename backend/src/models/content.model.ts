import { query } from '../config/db.js';
import type { ContentItem } from '../types/models.js';
import type { ListContentQuery } from '../schemas/content.schema.js';

export async function listContent(filters: ListContentQuery): Promise<ContentItem[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.type) {
    params.push(filters.type);
    conditions.push(`type = $${params.length}`);
  }

  if (filters.category) {
    params.push(filters.category);
    conditions.push(`category = $${params.length}`);
  }

  if (filters.age !== undefined) {
    params.push(filters.age);
    conditions.push(`age_min <= $${params.length}`);
    params.push(filters.age);
    conditions.push(`age_max >= $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query<ContentItem>(
    `SELECT * FROM content_items ${where} ORDER BY created_at ASC`,
    params
  );
  return result.rows;
}

export async function getContentById(id: string): Promise<ContentItem | null> {
  const result = await query<ContentItem>('SELECT * FROM content_items WHERE id = $1', [id]);
  return result.rows[0] ?? null;
}
