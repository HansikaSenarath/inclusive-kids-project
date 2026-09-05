import { query } from '../config/db.js';
import type { ChildProfile } from '../types/models.js';
import type { CreateProfileInput, UpdateProfileInput } from '../schemas/profile.schema.js';

const DEFAULT_PREFERENCES = {
  fontSize: 'large',
  highContrast: false,
  reduceMotion: false,
  voiceRate: 0.9,
};

export async function listProfiles(): Promise<ChildProfile[]> {
  const result = await query<ChildProfile>(
    'SELECT * FROM child_profiles ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function getProfileById(id: string): Promise<ChildProfile | null> {
  const result = await query<ChildProfile>('SELECT * FROM child_profiles WHERE id = $1', [id]);
  return result.rows[0] ?? null;
}

export async function createProfile(input: CreateProfileInput): Promise<ChildProfile> {
  const preferences = { ...DEFAULT_PREFERENCES, ...(input.preferences ?? {}) };

  const result = await query<ChildProfile>(
    `INSERT INTO child_profiles
      (name, age, avatar, pin, vision_impairment, hearing_impairment, speech_impairment, preferences)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      input.name,
      input.age,
      input.avatar ?? 'star',
      input.pin ?? null,
      input.vision_impairment ?? false,
      input.hearing_impairment ?? false,
      input.speech_impairment ?? false,
      JSON.stringify(preferences),
    ]
  );
  return result.rows[0];
}

export async function updateProfile(
  id: string,
  updates: UpdateProfileInput
): Promise<ChildProfile | null> {
  const existing = await getProfileById(id);
  if (!existing) return null;

  const merged = {
    name: updates.name ?? existing.name,
    age: updates.age ?? existing.age,
    avatar: updates.avatar ?? existing.avatar,
    pin: updates.pin === undefined ? existing.pin : updates.pin,
    vision_impairment: updates.vision_impairment ?? existing.vision_impairment,
    hearing_impairment: updates.hearing_impairment ?? existing.hearing_impairment,
    speech_impairment: updates.speech_impairment ?? existing.speech_impairment,
    preferences: updates.preferences
      ? { ...existing.preferences, ...updates.preferences }
      : existing.preferences,
  };

  const result = await query<ChildProfile>(
    `UPDATE child_profiles
     SET name = $1, age = $2, avatar = $3, pin = $4, vision_impairment = $5,
         hearing_impairment = $6, speech_impairment = $7, preferences = $8
     WHERE id = $9
     RETURNING *`,
    [
      merged.name,
      merged.age,
      merged.avatar,
      merged.pin,
      merged.vision_impairment,
      merged.hearing_impairment,
      merged.speech_impairment,
      JSON.stringify(merged.preferences),
      id,
    ]
  );
  return result.rows[0];
}

export async function deleteProfile(id: string): Promise<boolean> {
  const result = await query('DELETE FROM child_profiles WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
