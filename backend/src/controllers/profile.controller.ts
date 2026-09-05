import type { Request, Response } from 'express';
import { createProfileSchema, updateProfileSchema } from '../schemas/profile.schema.js';
import * as ProfileModel from '../models/profile.model.js';
import { HttpError } from '../utils/httpError.js';

export async function listProfiles(_req: Request, res: Response) {
  const profiles = await ProfileModel.listProfiles();
  res.json(profiles);
}

export async function getProfile(req: Request, res: Response) {
  const profile = await ProfileModel.getProfileById(req.params.id);
  if (!profile) throw HttpError.notFound('Profile not found');
  res.json(profile);
}

export async function createProfile(req: Request, res: Response) {
  const input = createProfileSchema.parse(req.body);
  const profile = await ProfileModel.createProfile(input);
  res.status(201).json(profile);
}

export async function updateProfile(req: Request, res: Response) {
  const input = updateProfileSchema.parse(req.body);
  const profile = await ProfileModel.updateProfile(req.params.id, input);
  if (!profile) throw HttpError.notFound('Profile not found');
  res.json(profile);
}

export async function deleteProfile(req: Request, res: Response) {
  const deleted = await ProfileModel.deleteProfile(req.params.id);
  if (!deleted) throw HttpError.notFound('Profile not found');
  res.status(204).send();
}
