import { Router } from 'express';
import * as ProfileController from '../controllers/profile.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const profileRouter = Router();

profileRouter.get('/', asyncHandler(ProfileController.listProfiles));
profileRouter.post('/', asyncHandler(ProfileController.createProfile));
profileRouter.get('/:id', asyncHandler(ProfileController.getProfile));
profileRouter.patch('/:id', asyncHandler(ProfileController.updateProfile));
profileRouter.delete('/:id', asyncHandler(ProfileController.deleteProfile));
