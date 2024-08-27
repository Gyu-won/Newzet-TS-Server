import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { NewsletterController } from '../controllers/newsletterController.ts';

const newsletterRouter = new Hono();
const newsletterController = new NewsletterController();

newsletterRouter.use(authMiddleware);

newsletterRouter.get('/search', (c) => newsletterController.searchNewsletterV1(c));
newsletterRouter.get('/:newsletterId', (c) => newsletterController.getNewsletterV1(c));

export default newsletterRouter;
