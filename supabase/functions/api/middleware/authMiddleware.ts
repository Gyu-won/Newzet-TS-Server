import { Context, Next } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { createResponse } from '../lib/response/responseFormat.ts';
import { ResponseCode } from '../lib/response/responseCode.ts';
import { supabase } from '../lib/supabase.ts';
import { AuthUser } from '../models/entities/user.ts';

export async function authMiddleware(context: Context, next: Next) {
  const authHeader = context.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return context.json(createResponse(ResponseCode.UNAUTHORIZED, 'Unauthorized', null), 401);
  }

  const jwtToken = authHeader.split(' ')[1];
  const authUser = await decodeJWT(jwtToken);
  if (!authUser) {
    return context.json(createResponse(ResponseCode.UNAUTHORIZED, 'Unauthorized', null), 401);
  }

  context.set('user', authUser);

  await next();
}

async function decodeJWT(jwtToken: string): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser(jwtToken);

  if (error) {
    console.error('JWT 검증 실패: ', error.message);
    return null;
  }

  if (data.user == null) {
    console.error('존재하지 않는 유저');
    return null;
  }

  return AuthUser.fromUser(data.user);
}
