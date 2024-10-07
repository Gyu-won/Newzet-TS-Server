import { Context } from 'https://deno.land/x/hono@v4.3.11/context.ts';
import { createErrorResponse, logError } from '../lib/exceptions/errorHandler.ts';
import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { WelcomeService } from '../services/welcomeService.ts';

export class WelcomeController {
  private welcomeService: WelcomeService;

  constructor() {
    this.welcomeService = new WelcomeService();
  }

  async sendWelcomeMailV1(c: Context) {
    try {
      const userId = c.get('user').id;
      await this.welcomeService.sendWelcomeMail(userId);
      return c.json(createResponse(ResponseCode.SUCCESS, '웰컴메일 전송 성공', null));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }
}
