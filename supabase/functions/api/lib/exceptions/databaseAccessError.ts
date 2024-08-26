export class DatabaseAccessError extends Error {
  constructor(message: string);
  constructor(message: string, detail: string);

  constructor(message: string, detail?: string) {
    super(detail ? `${message}: ${detail}` : message);
    this.name = 'DatabaseAccessError';
  }
}
