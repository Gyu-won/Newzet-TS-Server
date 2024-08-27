import { Context } from 'https://deno.land/x/hono@v4.3.11/context.ts';
import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { NewsletterService } from '../services/newsletterService.ts';
import { InvalidArgumentsError } from '../lib/exceptions/invalidArgumentsError.ts';
import { createErrorResponse, logError } from '../lib/exceptions/errorHandler.ts';

export class NewsletterController {
  private newsletterService: NewsletterService;

  constructor() {
    this.newsletterService = new NewsletterService();
  }

  async getNewsletterV1(c: Context) {
    try {
      const userId = c.get('user').id;

      const newsletterId = c.req.param('newsletterId') ?? '';
      if (!newsletterId) {
        throw new InvalidArgumentsError(`뉴스레터 조회 시 ID가 필요합니다.`);
      }

      const newsletter = await this.newsletterService.getNewsletterInfo(newsletterId, userId);

      return c.json(createResponse(ResponseCode.SUCCESS, '뉴스레터 조회 성공', newsletter));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }

  async searchNewsletterV1(c: Context) {
    try {
      const name = c.req.query('name');
      const categoryId = c.req.query('categoryId');

      const newsletterList = await this.newsletterService.searchNewsletterListByNameOrCategoryId(
        name,
        categoryId,
      );

      return c.json(createResponse(ResponseCode.SUCCESS, '뉴스레터 검색 성공', newsletterList));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }
}
