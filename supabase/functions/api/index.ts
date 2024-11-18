import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import {
  articleRouter,
  categoryRouter,
  eventRouter,
  fcmTokenRouter,
  newsletterRouter,
  subscriptionRouter,
  userinfoRouter,
} from './routers/index.ts';
import welcomeRouter from './routers/welcomeRouter.ts';
import widgetRouter from './routers/widgetRouter.ts';

const app = new Hono();

app.basePath('/api').route('/article', articleRouter);
app.basePath('/api').route('/category', categoryRouter);
app.basePath('/api').route('/event', eventRouter);
app.basePath('/api').route('/fcm_token', fcmTokenRouter);
app.basePath('/api').route('/my', userinfoRouter);
app.basePath('/api').route('/subscription', subscriptionRouter);
app.basePath('/api').route('/newsletter', newsletterRouter);
app.basePath('/api').route('/welcome', welcomeRouter);
app.basePath('/api').route('/widget', widgetRouter);

Deno.serve(app.fetch);
