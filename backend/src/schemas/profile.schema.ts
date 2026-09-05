import { z } from 'zod';

const preferencesSchema = z.object({
  fontSize: z.enum(['medium', 'large', 'xlarge']),
  highContrast: z.boolean(),
  reduceMotion: z.boolean(),
  voiceRate: z.number(),
});

export const createProfileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  age: z.number().int().min(4).max(16),
  avatar: z.string().trim().min(1).max(40).default('star'),
  pin: z.string().trim().max(20).nullable().optional(),
  vision_impairment: z.boolean().default(false),
  hearing_impairment: z.boolean().default(false),
  speech_impairment: z.boolean().default(false),
  preferences: preferencesSchema.partial().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  age: z.number().int().min(4).max(16).optional(),
  avatar: z.string().trim().min(1).max(40).optional(),
  pin: z.string().trim().max(20).nullable().optional(),
  vision_impairment: z.boolean().optional(),
  hearing_impairment: z.boolean().optional(),
  speech_impairment: z.boolean().optional(),
  preferences: preferencesSchema.partial().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
