export class StorageAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageAccessError';
  }
}
