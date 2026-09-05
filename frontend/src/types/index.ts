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

export interface ProfilePreferences {
  fontSize: 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  reduceMotion: boolean;
  voiceRate: number;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  type: 'story' | 'quiz' | 'game';
  age_min: number;
  age_max: number;
  category: string;
  content: StoryContent | QuizContent;
  has_audio: boolean;
  has_captions: boolean;
  has_visual: boolean;
  icon: string;
  created_at: string;
}

export interface StoryContent {
  pages: StoryPage[];
}

export interface StoryPage {
  text: string;
  image: string;
}

export interface QuizContent {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  emoji: string;
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

export interface AACBoard {
  id: string;
  child_id: string | null;
  name: string;
  symbols: AACSymbol[];
  created_at: string;
}

export interface AACSymbol {
  id: string;
  label: string;
  emoji: string;
  category: string;
}

export type ViewName =
  | 'onboarding'
  | 'home'
  | 'learn'
  | 'communicate'
  | 'progress'
  | 'dashboard'
  | 'settings'
  | 'story-viewer'
  | 'quiz-viewer';

export type AbilityMode = 'voice' | 'visual' | 'caption' | 'combined';
