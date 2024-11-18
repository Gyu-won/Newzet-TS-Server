import { Context } from 'https://deno.land/x/hono@v4.3.11/context.ts';
import { createErrorResponse, logError } from '../lib/exceptions/errorHandler.ts';
import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { WidgetService } from '../services/widgetService.ts';

export class WidgetController {
  private widgetService: WidgetService;

  constructor() {
    this.widgetService = new WidgetService();
  }

  async getWidgetV1(c: Context) {
    try {
      const userId = c.get('user').id;
      const widget = await this.widgetService.getWidget(userId);
      return c.json(createResponse(ResponseCode.SUCCESS, '위젯 데이터 조회 성공', widget));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }
}
