import { Context } from 'https://deno.land/x/hono@v4.3.11/context.ts';
import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { FcmTokenService } from '../services/fcmTokenService.ts';
import { createErrorResponse, logError } from '../lib/exceptions/errorHandler.ts';
import { InvalidArgumentsError } from '../lib/exceptions/invalidArgumentsError.ts';

export class FcmTokenController {
  private fcmTokenService: FcmTokenService;

  constructor() {
    this.fcmTokenService = new FcmTokenService();
  }

  async postFCMTokenV1(c: Context) {
    try {
      const userId = c.get('user').id;

      const { fcmToken } = await c.req.json();
      if (!fcmToken) {
        throw new InvalidArgumentsError('Missing fcmToken');
      }

      await this.fcmTokenService.addFCMToken(userId, fcmToken);
      return c.json(createResponse(ResponseCode.SUCCESS, 'FCM 토큰 생성 성공', null));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }

  async deleteFCMTokenV1(c: Context) {
    try {
      const userId = c.get('user').id;

      const { fcmToken } = await c.req.json();
      if (!fcmToken) {
        throw new InvalidArgumentsError('Missing fcmToken');
      }

      await this.fcmTokenService.deleteFCMToken(userId, fcmToken);
      return c.json(createResponse(ResponseCode.SUCCESS, 'FCM 토큰 삭제 성공', null));
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      logError(c, error);
      return c.json(errorResponse);
    }
  }
}
