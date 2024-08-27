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
