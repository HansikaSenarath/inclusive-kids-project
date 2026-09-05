import { Router } from 'express';
import { profileRouter } from './profile.routes.js';
import { contentRouter } from './content.routes.js';
import { progressRouter } from './progress.routes.js';
import { aacBoardRouter } from './aacBoard.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.use('/profiles', profileRouter);
apiRouter.use('/content', contentRouter);
apiRouter.use('/progress', progressRouter);
apiRouter.use('/aac-boards', aacBoardRouter);
