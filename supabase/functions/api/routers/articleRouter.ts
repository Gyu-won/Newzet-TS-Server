import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { ArticleController } from '../controllers/articleController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const articleRouter = new Hono();
const articleController = new ArticleController();

articleRouter.get('', authMiddleware, (c) => articleController.getArticleListV1(c));
articleRouter.get('/:articleId', authMiddleware, (c) => articleController.getArticleV1(c));
articleRouter.get('/share/:articleId', (c) => articleController.getSharedArticleV1(c));
articleRouter.patch('/share/:articleId', authMiddleware, (c) =>
  articleController.shareArticleV1(c),
);

export default articleRouter;
