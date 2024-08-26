import { Context } from 'https://deno.land/x/hono@v4.3.11/mod.ts';

import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { UserinfoService } from '../services/userinfoService.ts';

export class UserinfoController {
  private userinfoService: UserinfoService;

  constructor() {
    this.userinfoService = new UserinfoService();
  }

  async getUserinfoV1(c: Context) {
    try {
      const userId = c.get('user').id;
      const myInfo = await this.userinfoService.getUserinfo(userId);
      return c.json(createResponse(ResponseCode.SUCCESS, 'my info 조회 성공', myInfo));
    } catch (error) {
      return c.json(createResponse(ResponseCode.SERVER_ERROR, 'my info 조회 실패', error.message));
    }
  }
}
