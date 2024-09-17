import { Context, Next } from 'https://deno.land/x/hono@v4.3.11/mod.ts';
import { supabase } from '../lib/supabase.ts';
import { AuthUser } from '../models/entities/user.ts';

export async function authOptionMiddleware(context: Context, next: Next) {
  const authHeader = context.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwtToken = authHeader.split(' ')[1];
    const authUser = await decodeJWT(jwtToken);
    if (authUser) {
      context.set('user', authUser);
    }
  }

  await next();
}

async function decodeJWT(jwtToken: string): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser(jwtToken);

  if (error) {
    return null;
  }
  if (data.user == null) {
    return null;
  }

  return AuthUser.fromUser(data.user);
}
