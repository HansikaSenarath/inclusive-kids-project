import { Router } from 'express';
import * as ContentController from '../controllers/content.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const contentRouter = Router();

contentRouter.get('/', asyncHandler(ContentController.listContent));
contentRouter.get('/:id', asyncHandler(ContentController.getContent));
