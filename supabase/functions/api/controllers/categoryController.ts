import { Context } from 'https://deno.land/x/hono@v4.3.11/mod.ts';

import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { CategoryListResDto } from '../models/category/categoryListResDto.ts';
import { CategoryService } from '../services/categoryService.ts';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async getCategoryListV1(c: Context) {
    try {
      const categoryList: CategoryListResDto = await this.categoryService.getCategoryList();
      return c.json(createResponse(ResponseCode.SUCCESS, '카테고리 목록 조회 성공', categoryList));
    } catch (error) {
      return c.json(
        createResponse(ResponseCode.INVALID_ARGUMENTS, '카테고리 목록 조회 실패', error.message),
      );
    }
  }
}
