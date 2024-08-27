import { Context } from 'https://deno.land/x/hono@v4.3.11/mod.ts';

import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { ArticleService } from '../services/articleService.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { createErrorResponse, logError } from '../lib/exceptions/errorHandler.ts';

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  async getArticleListV1(c: Context) {
    try {
      const userId = c.get('user').id;
      const articleList: ArticleListResDto = await this.articleService.getArticleList(userId);
      return c.json(createResponse(ResponseCode.SUCCESS, '아티클 목록 조회 성공', articleList));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }
}
