import { Context } from 'https://deno.land/x/hono@v4.3.11/mod.ts';

import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { SubscriptionService } from '../services/subscriptionService.ts';
import { createErrorResponse } from '../lib/exceptions/errorHandler.ts';

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  async getSubscriptionListV1(c: Context) {
    try {
      const userId = c.get('user').id;

      const subscriptionList = await this.subscriptionService.getSubscriptionList(userId);
      return c.json(createResponse(ResponseCode.SUCCESS, '구독 목록 조회 성공', subscriptionList));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      return c.json(errorResponse);
    }
  }
}
