import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { UserinfoController } from '../controllers/userinfoController.ts';

const userinfoRouter = new Hono();

const userinfoController = new UserinfoController();

userinfoRouter.use(authMiddleware);

userinfoRouter.get('', (c) => userinfoController.getUserinfoV1(c));
userinfoRouter.patch('', (c) => userinfoController.updateUserinfoV1(c));
userinfoRouter.get('/init', (c) => userinfoController.getIsInitializedV1(c));

export default userinfoRouter;
