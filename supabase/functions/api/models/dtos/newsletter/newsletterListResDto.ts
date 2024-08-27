import { NewsletterResDto } from './newsletterResDto.ts';

export class NewsletterListResDto {
  newsletterList: NewsletterResDto[];

  constructor(newsletterList: NewsletterResDto[]) {
    this.newsletterList = newsletterList;
  }
}
