import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { ArticleController } from '../controllers/articleController.ts';

const articleRouter = new Hono();

const articleController = new ArticleController();

articleRouter.get('', (c) => articleController.getArticleListV1(c));

export default articleRouter;
