-- InclusiveKids Hub - Core Database Schema
-- Creates child_profiles, content_items, progress_logs, aac_boards.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS child_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age int NOT NULL CHECK (age >= 4 AND age <= 16),
  avatar text NOT NULL DEFAULT 'star',
  pin text,
  vision_impairment boolean NOT NULL DEFAULT false,
  hearing_impairment boolean NOT NULL DEFAULT false,
  speech_impairment boolean NOT NULL DEFAULT false,
  preferences jsonb NOT NULL DEFAULT '{"fontSize": "large", "highContrast": false, "reduceMotion": false, "voiceRate": 0.9}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('story', 'quiz', 'game')),
  age_min int NOT NULL DEFAULT 4,
  age_max int NOT NULL DEFAULT 16,
  category text NOT NULL DEFAULT 'literacy',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  has_audio boolean NOT NULL DEFAULT true,
  has_captions boolean NOT NULL DEFAULT true,
  has_visual boolean NOT NULL DEFAULT true,
  icon text NOT NULL DEFAULT 'book',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  score int DEFAULT 0,
  stars int DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS aac_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Board',
  symbols jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_child ON progress_logs(child_id);
CREATE INDEX IF NOT EXISTS idx_content_age ON content_items(age_min, age_max);
CREATE INDEX IF NOT EXISTS idx_aac_child ON aac_boards(child_id);
