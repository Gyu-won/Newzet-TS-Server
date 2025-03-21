import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { SubscriptionController } from '../controllers/subscriptionController.ts';

const subscriptionRouter = new Hono();
const subscriptionController = new SubscriptionController();

subscriptionRouter.use(authMiddleware);

// 구독 목록 조회 API
/// v1: GET /subscription
/// get_subscription_list_with_image RPC 호출
/// v2: GET /subscription/list
/// get_subscription_with_image RPC 호출
subscriptionRouter.get('', (c) => subscriptionController.getSubscriptionListV1(c));
subscriptionRouter.get('/list', (c) => subscriptionController.getSubscriptionListV2(c));

subscriptionRouter.delete('/:subscriptionId', (c) =>
  subscriptionController.deleteSubscriptionV1(c),
);

export default subscriptionRouter;
