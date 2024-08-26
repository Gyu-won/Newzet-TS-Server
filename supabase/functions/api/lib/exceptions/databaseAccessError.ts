export class DatabaseAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseAccessError';
  }
}
