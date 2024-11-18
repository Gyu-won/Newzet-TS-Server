import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { WidgetController } from '../controllers/widgetController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const widgetRouter = new Hono();
widgetRouter.use(authMiddleware);

const widgetController = new WidgetController();

widgetRouter.get('', (c) => widgetController.getWidgetV1(c));

export default widgetRouter;
