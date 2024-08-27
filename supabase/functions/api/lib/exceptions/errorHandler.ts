import { Context } from 'https://deno.land/x/hono@v4.3.11/context.ts';
import { ResponseCode } from '../response/responseCode.ts';
import { createResponse } from '../response/responseFormat.ts';

export function createErrorResponse(error: Error) {
  let responseCode;

  switch (error.name) {
    case 'DatabaseAccessError':
      responseCode = ResponseCode.DATABASE_ACCESS_ERROR;
      break;
    case 'InvalidArgumentsError':
      responseCode = ResponseCode.INVALID_ARGUMENTS;
      break;
    case 'SupabaseError':
      responseCode = ResponseCode.SUPABASE_ERROR;
      break;
    default:
      responseCode = ResponseCode.SERVER_ERROR;
      break;
  }

  return createResponse(responseCode, error.message, null);
}

export function logError(c: Context, error: Error) {
  console.error(`[${c.req.raw.method} ${c.req.path}] ${error.message}`);
}
