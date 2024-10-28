import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { SubscriptionController } from '../controllers/subscriptionController.ts';

const subscriptionRouter = new Hono();
const subscriptionController = new SubscriptionController();

subscriptionRouter.use(authMiddleware);

subscriptionRouter.get('', (c) => subscriptionController.getSubscriptionListV1(c));
subscriptionRouter.delete('/:subscriptionId', (c) =>
  subscriptionController.deleteSubscriptionV1(c),
);

export default subscriptionRouter;
