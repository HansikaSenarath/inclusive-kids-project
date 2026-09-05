import { Router } from 'express';
import * as AacBoardController from '../controllers/aacBoard.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const aacBoardRouter = Router();

aacBoardRouter.get('/', asyncHandler(AacBoardController.listAacBoards));
aacBoardRouter.post('/', asyncHandler(AacBoardController.createAacBoard));
aacBoardRouter.patch('/:id', asyncHandler(AacBoardController.updateAacBoard));
