export class s3AccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'S3AccessError';
  }
}
