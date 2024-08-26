import { Context } from 'https://deno.land/x/hono@v4.3.11/mod.ts';

import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { UserinfoService } from '../services/userinfoService.ts';
import { UserinfoReqDto } from '../models/dtos/userinfo/UserinfoReqDto.ts';

export class UserinfoController {
  private userinfoService: UserinfoService;

  constructor() {
    this.userinfoService = new UserinfoService();
  }

  async getUserinfoV1(c: Context) {
    try {
      const userId = c.get('user').id;
      const myInfo = await this.userinfoService.getUserinfo(userId);
      return c.json(createResponse(ResponseCode.SUCCESS, '유저 정보 조회 성공', myInfo));
    } catch (error) {
      return c.json(
        createResponse(ResponseCode.SERVER_ERROR, '유저 정보 조회 실패', error.message),
      );
    }
  }

  async updateUserinfoV1(c: Context) {
    try {
      const userId = c.get('user').id;
      const userinfo: UserinfoReqDto = await c.req.json();

      await this.userinfoService.updateUserinfo(userId, userinfo);

      return c.json(createResponse(ResponseCode.SUCCESS, '유저 정보 수정 성공', null));
    } catch (error) {
      return c.json(
        createResponse(ResponseCode.SERVER_ERROR, '유저 정보 수정 실패', error.message),
      );
    }
  }
}
