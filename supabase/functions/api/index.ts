import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import categoryRouter from './routers/categoryRouter.ts';

const app = new Hono();

app.basePath('/api').route('/category', categoryRouter);

Deno.serve(app.fetch);
