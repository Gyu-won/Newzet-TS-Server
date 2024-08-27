import { NewsletterInfoResDto } from '../models/dtos/newsletter/newsletterInfoResDto.ts';
import { NewsletterListResDto } from '../models/dtos/newsletter/newsletterListResDto.ts';
import { NewsletterResDto } from '../models/dtos/newsletter/newsletterResDto.ts';
import { CategoryRepository } from '../repositories/categoryRepository.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';

export class NewsletterService {
  private newsletterRepository: NewsletterRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.newsletterRepository = new NewsletterRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async getNewsletterInfo(newsletterId: string, userId: string): Promise<NewsletterInfoResDto> {
    const newsletter = await this.newsletterRepository.getNewsletterById(newsletterId);
    const category = await this.categoryRepository.getCategoryById(newsletter.category_id);

    // [TODO] 구독 여부 확인 로직 추가
    return new NewsletterInfoResDto(newsletter, false, category.name);
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
