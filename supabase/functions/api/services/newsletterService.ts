import { NewsletterInfoResDto } from '../models/dtos/newsletter/newsletterInfoResDto.ts';
import { NewsletterListResDto } from '../models/dtos/newsletter/newsletterListResDto.ts';
import { NewsletterResDto } from '../models/dtos/newsletter/newsletterResDto.ts';
import { Newsletter } from '../models/entities/newsletter.ts';
import { CategoryRepository } from '../repositories/categoryRepository.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';
import { SubscriptionRepository } from '../repositories/subscriptionRepository.ts';

export class NewsletterService {
  private newsletterRepository: NewsletterRepository;
  private categoryRepository: CategoryRepository;
  private subscriptionRepository: SubscriptionRepository;

  constructor() {
    this.newsletterRepository = new NewsletterRepository();
    this.categoryRepository = new CategoryRepository();
    this.subscriptionRepository = new SubscriptionRepository();
  }

  async getNewsletterInfo(newsletterId: string, userId: string): Promise<NewsletterInfoResDto> {
    const newsletter = await this.newsletterRepository.getNewsletterById(newsletterId);
    const category = await this.categoryRepository.getCategoryById(newsletter.category_id);
    const isSubscribing = await this.subscriptionRepository.getIsSubscribing(
      userId,
      newsletter.domain,
    );

    return new NewsletterInfoResDto(newsletter, isSubscribing, category.name);
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

  async getNewsletterByDomain(newsletterDomain: string): Promise<Newsletter | null> {
    const newsletter = await this.newsletterRepository.getNewsletterByDomain(newsletterDomain);
    return newsletter;
  }
}
