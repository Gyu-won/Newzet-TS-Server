import { NewsletterInfoResDto } from '../models/dtos/newsletter/newsletterInfoResDto.ts';
import { NewsletterListResDto } from '../models/dtos/newsletter/newsletterListResDto.ts';
import { NewsletterRecommendResDto } from '../models/dtos/newsletter/newsletterRecommendResDto.ts';
import { NewsletterResDto } from '../models/dtos/newsletter/newsletterResDto.ts';
import { Newsletter } from '../models/entities/newsletter.ts';
import { CategoryRepository } from '../repositories/categoryRepository.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';
import { SubscriptionRepository } from '../repositories/subscriptionRepository.ts';
import { UserCategoryRepository } from '../repositories/userCategoryRepository.ts';

export class NewsletterService {
  private newsletterRepository: NewsletterRepository;
  private categoryRepository: CategoryRepository;
  private subscriptionRepository: SubscriptionRepository;
  private userCategoryRepository: UserCategoryRepository;

  constructor() {
    this.newsletterRepository = new NewsletterRepository();
    this.categoryRepository = new CategoryRepository();
    this.subscriptionRepository = new SubscriptionRepository();
    this.userCategoryRepository = new UserCategoryRepository();
  }

  async getNewsletterInfo(newsletterId: string, userId: string): Promise<NewsletterInfoResDto> {
    const newsletter = await this.newsletterRepository.getNewsletterById(newsletterId);
    const category = await this.categoryRepository.getCategoryById(newsletter.category_id);
    const isSubscribing = await this.subscriptionRepository.getIsSubscribing(
      userId,
      newsletter.domain,
      newsletter.mailling_list,
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

  async getNewsletterByMaillingListOrDomain(
    newsletterMaillingList: string,
    newsletterDomain: string,
  ): Promise<Newsletter | null> {
    if (newsletterMaillingList == null) {
      return await this.newsletterRepository.getNewsletterByDomain(newsletterDomain);
    }
    return await this.newsletterRepository.getNewsletterByMaillingList(newsletterMaillingList);
  }

  async recommendNewsletterList(userId: string): Promise<NewsletterRecommendResDto> {
    const userCategoryList = await this.userCategoryRepository.getUserCategoryListByUserId(userId);
    const userCategoryIdList = userCategoryList.map((category) => category.id);

    const newsletterList =
      await this.newsletterRepository.getNewsletterListByCategoryIdList(userCategoryIdList);

    const recommendedNewsletterList = this.getRandomNewsletterList(newsletterList, 4);
    return new NewsletterRecommendResDto(
      recommendedNewsletterList.map((newsletter) => new NewsletterResDto(newsletter)),
    );
  }

  getRandomNewsletterList(newsletters: Newsletter[], count: number): Newsletter[] {
    const shuffled = newsletters.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
