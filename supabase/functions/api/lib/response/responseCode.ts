// 서비스의 오류 세분화 하여 작성할때 사용
export enum ResponseCode {
  SUCCESS = 20000,
  INVALID_ARGUMENTS = 40000,
  UNAUTHORIZED = 40001,
  FORBIDDEN = 40003,
  SERVER_ERROR = 50000,
  DATABASE_ACCESS_ERROR = 50002,
  SUPABASE_ERROR = 50005,
  S3_ACCESS_ERROR = 50006,
  STORAGE_ACCESS_ERROR = 50007,
}
