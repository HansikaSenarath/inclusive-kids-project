export interface ProfilePreferences {
  fontSize: 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  reduceMotion: boolean;
  voiceRate: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  pin: string | null;
  vision_impairment: boolean;
  hearing_impairment: boolean;
  speech_impairment: boolean;
  preferences: ProfilePreferences;
  created_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  type: 'story' | 'quiz' | 'game';
  age_min: number;
  age_max: number;
  category: string;
  content: Record<string, unknown>;
  has_audio: boolean;
  has_captions: boolean;
  has_visual: boolean;
  icon: string;
  created_at: string;
}

export interface ProgressLog {
  id: string;
  child_id: string;
  content_id: string;
  completed: boolean;
  score: number;
  stars: number;
  created_at: string;
}

export interface AACSymbol {
  id: string;
  label: string;
  emoji: string;
  category: string;
}

export interface AACBoard {
  id: string;
  child_id: string | null;
  name: string;
  symbols: AACSymbol[];
  created_at: string;
}
