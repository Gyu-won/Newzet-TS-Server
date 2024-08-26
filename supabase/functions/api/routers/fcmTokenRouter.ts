import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { FcmTokenController } from '../controllers/fcmTokenController.ts';

const fcmTokenRouter = new Hono();
const fcmTokenController = new FcmTokenController();

fcmTokenRouter.use(authMiddleware);

fcmTokenRouter.post('', (c) => fcmTokenController.postFCMTokenV1(c));
fcmTokenRouter.delete('', (c) => fcmTokenController.deleteFCMTokenV1(c));

export default fcmTokenRouter;
