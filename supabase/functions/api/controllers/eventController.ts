import { Context } from 'https://deno.land/x/hono@v4.3.11/context.ts';
import { EventService } from '../services/eventService.ts';
import { createErrorResponse, logError } from '../lib/exceptions/errorHandler.ts';
import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { EventListResDto } from '../models/dtos/event/eventListResDto.ts';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  async getEventListV1(c: Context) {
    try {
      const eventList: EventListResDto = await this.eventService.getEventList();
      return c.json(createResponse(ResponseCode.SUCCESS, '이벤트 목록 조회 성공', eventList));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }
}
