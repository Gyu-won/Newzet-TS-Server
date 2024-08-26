import { Context } from 'https://deno.land/x/hono@v4.3.11/context.ts';
import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { FcmTokenService } from '../services/fcmTokenService.ts';

export class FcmTokenController {
  private fcmTokenService: FcmTokenService;

  constructor() {
    this.fcmTokenService = new FcmTokenService();
  }

  async postFCMTokenV1(c: Context) {
    const userId = c.get('user').id;
    const { fcmToken } = await c.req.json();

    if (!fcmToken) {
      return c.json(createResponse(ResponseCode.INVALID_ARGUMENTS, 'Missing fcmToken', null));
    }

    try {
      await this.fcmTokenService.addFCMToken(userId, fcmToken);

      return c.json(createResponse(ResponseCode.SUCCESS, 'FCM 토큰 생성 성공', null));
    } catch (error) {
      return c.json(createResponse(ResponseCode.SERVER_ERROR, 'FCM 토큰 생성 실패', error.message));
    }
  }

  async deleteFCMTokenV1(c: Context) {
    const userId = c.get('user').id;
    const { fcmToken } = await c.req.json();

    if (!fcmToken) {
      return c.json(createResponse(ResponseCode.INVALID_ARGUMENTS, 'Missing fcmToken', null));
    }

    try {
      await this.fcmTokenService.deleteFCMToken(userId, fcmToken);

      return c.json(createResponse(ResponseCode.SUCCESS, 'FCM 토큰 삭제 성공', null));
    } catch (error) {
      return c.json(createResponse(ResponseCode.SERVER_ERROR, 'FCM 토큰 삭제 실패', error.message));
    }
  }
}
