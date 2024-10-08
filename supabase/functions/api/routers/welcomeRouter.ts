import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { WelcomeController } from '../controllers/welcomeController.ts';

const welcomeRouter = new Hono();

const welcomeController = new WelcomeController();

welcomeRouter.use(authMiddleware);

welcomeRouter.post('', (c) => welcomeController.sendWelcomeMailV1(c));

export default welcomeRouter;
