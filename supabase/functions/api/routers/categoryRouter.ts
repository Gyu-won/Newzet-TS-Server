import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { CategoryController } from '../controllers/categoryController.ts';

const categoryRouter = new Hono();

const categoryController = new CategoryController();

categoryRouter.get('', (c) => categoryController.getCategoryListV1(c));

export default categoryRouter;
