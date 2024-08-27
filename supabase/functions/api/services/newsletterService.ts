import { NewsletterListResDto } from '../models/dtos/newsletter/newsletterListResDto.ts';
import { NewsletterResDto } from '../models/dtos/newsletter/newsletterResDto.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';

export class NewsletterService {
  private newsletterRepository: NewsletterRepository;

  constructor() {
    this.newsletterRepository = new NewsletterRepository();
  }

  async searchNewsletterListByNameOrCategoryId(
    name: string | undefined,
    categoryId: string | undefined,
  ): Promise<NewsletterListResDto> {
    const newsletterList = await this.newsletterRepository.getNewsletterListByNameOrCategoryId(
      name,
      categoryId,
    );

    return new NewsletterListResDto(
      newsletterList.map((newsletter) => new NewsletterResDto(newsletter)),
    );
  }
}
