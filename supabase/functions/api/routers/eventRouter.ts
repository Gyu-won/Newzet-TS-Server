import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { EventController } from '../controllers/eventController.ts';

const eventRouter = new Hono();

const eventController = new EventController();

eventRouter.get('', (c) => eventController.getEventListV1(c));

export default eventRouter;
