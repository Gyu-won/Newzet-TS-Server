// deno-lint-ignore-file no-explicit-any
import { ResponseCode } from './responseCode.ts';

export interface ResponseFormat<T extends Record<string, any> | null> {
  code: ResponseCode;
  message: string;
  result: T;
}

export function createResponse<T extends Record<string, any> | null>(
  code: ResponseCode,
  message: string,
  result: T,
): ResponseFormat<T> {
  return { code, message, result };
}
