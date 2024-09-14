import { NewsletterResDto } from './newsletterResDto.ts';

export class NewsletterRecommendResDto {
  newsletterRecommendList: NewsletterResDto[];

  constructor(newsletterList: NewsletterResDto[]) {
    this.newsletterRecommendList = newsletterList;
  }
}
