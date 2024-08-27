import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';

import { articleRouter, categoryRouter, fcmTokenRouter, userinfoRouter } from './routers/index.ts';

const app = new Hono();

app.basePath('/api').route('/article', articleRouter);
app.basePath('/api').route('/category', categoryRouter);
app.basePath('/api').route('/fcm_token', fcmTokenRouter);
app.basePath('/api').route('/my', userinfoRouter);

Deno.serve(app.fetch);
