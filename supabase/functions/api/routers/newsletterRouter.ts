import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { NewsletterController } from '../controllers/newsletterController.ts';
import { authOptionMiddleware } from '../middleware/authOptionMiddleware.ts';

const newsletterRouter = new Hono();
const newsletterController = new NewsletterController();

// mandatory auth
newsletterRouter.get('/recommend', authMiddleware, (c) =>
  newsletterController.recommendNewsletterListV1(c),
);

// optional auth
newsletterRouter.get('/search', authOptionMiddleware, (c) =>
  newsletterController.searchNewsletterV1(c),
);
newsletterRouter.get('/:newsletterId', authOptionMiddleware, (c) =>
  newsletterController.getNewsletterV1(c),
);

export default newsletterRouter;
