export class UniqueMailResDto {
  isUnique: boolean;
  message: string;

  constructor(isUnique: boolean, message: string) {
    this.isUnique = isUnique;
    this.message = message;
  }
}
