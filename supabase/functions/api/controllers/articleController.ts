import { Context } from 'https://deno.land/x/hono@v4.3.11/mod.ts';

import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { ArticleService } from '../services/articleService.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { createErrorResponse, logError } from '../lib/exceptions/errorHandler.ts';
import { InvalidArgumentsError } from '../lib/exceptions/invalidArgumentsError.ts';
import { ArticleShareResDto } from '../models/dtos/article/articleShareResDto.ts';

export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  async getArticleListV1(c: Context) {
    try {
      const userId = c.get('user').id;
      const year = parseInt(c.req.query('y') ?? '0');
      const month = parseInt(c.req.query('m') ?? '0');
      if (year == 0 || month < 1 || month > 12) {
        throw new InvalidArgumentsError('올바르지 않은 년/월 입력');
      }
      const articleList: ArticleListResDto = await this.articleService.getArticleList(
        userId,
        year,
        month,
      );
      return c.json(createResponse(ResponseCode.SUCCESS, '아티클 목록 조회 성공', articleList));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }

  async getArticleV1(c: Context) {
    try {
      const articleId = c.req.param('articleId') ?? '';
      const article = await this.articleService.getArticleAndRead(articleId);
      return c.json(createResponse(ResponseCode.SUCCESS, '아티클 조회 성공', article));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }

  async shareArticleV1(c: Context) {
    try {
      const articleId = c.req.param('articleId') ?? '';
      const sharedArticle: ArticleShareResDto = await this.articleService.shareArticle(articleId);
      return c.json(createResponse(ResponseCode.SUCCESS, '아티클 공유 성공', sharedArticle));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }
}
