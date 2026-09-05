import { Router } from 'express';
import * as ProgressController from '../controllers/progress.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const progressRouter = Router();

progressRouter.get('/', asyncHandler(ProgressController.listProgress));
progressRouter.post('/', asyncHandler(ProgressController.createProgress));
