import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const userinfoRouter = new Hono();

userinfoRouter.use(authMiddleware);

export default userinfoRouter;
