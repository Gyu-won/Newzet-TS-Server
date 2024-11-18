import { NewsletterInfoResDto } from '../models/dtos/newsletter/newsletterInfoResDto.ts';
import { NewsletterListResDto } from '../models/dtos/newsletter/newsletterListResDto.ts';
import { NewsletterRecommendResDto } from '../models/dtos/newsletter/newsletterRecommendResDto.ts';
import { NewsletterResDto } from '../models/dtos/newsletter/newsletterResDto.ts';
import { Newsletter } from '../models/entities/newsletter.ts';
import { AdvertiseRepository } from '../repositories/advertiseRepository.ts';
import { CategoryRepository } from '../repositories/categoryRepository.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';
import { SubscriptionRepository } from '../repositories/subscriptionRepository.ts';
import { UserCategoryRepository } from '../repositories/userCategoryRepository.ts';

export class NewsletterService {
  private newsletterRepository: NewsletterRepository;
  private categoryRepository: CategoryRepository;
  private subscriptionRepository: SubscriptionRepository;
  private userCategoryRepository: UserCategoryRepository;
  private advertiseRepository: AdvertiseRepository;

  constructor() {
    this.newsletterRepository = new NewsletterRepository();
    this.categoryRepository = new CategoryRepository();
    this.subscriptionRepository = new SubscriptionRepository();
    this.userCategoryRepository = new UserCategoryRepository();
    this.advertiseRepository = new AdvertiseRepository();
  }

  async getNewsletter(newsletterId: string): Promise<NewsletterInfoResDto> {
    const newsletter = await this.newsletterRepository.getNewsletterById(newsletterId);
    const category = await this.categoryRepository.getCategoryById(newsletter.category_id);

    return new NewsletterInfoResDto(newsletter, false, category.name);
  }

  async getNewsletterWithSubscription(
    newsletterId: string,
    userId: string,
  ): Promise<NewsletterInfoResDto> {
    const newsletter = await this.newsletterRepository.getNewsletterById(newsletterId);
    const category = await this.categoryRepository.getCategoryById(newsletter.category_id);
    const subscription = await this.subscriptionRepository.getSubscriptionByDomainOrMaillingList(
      userId,
      newsletter.domain,
      newsletter.mailling_list,
    );
    const isSubscribing = subscription != null;

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

    const advertiseNewsletterIdList = await this.advertiseRepository.getAdvertiseNewsletterIdList();
    const advertiseNewsletterList = await Promise.all(
      advertiseNewsletterIdList.map((advertise) =>
        this.newsletterRepository.getNewsletterById(advertise.newsletter_id),
      ),
    );

    const recommendNumber = 4 - advertiseNewsletterList.length;
    const newsletterList =
      await this.newsletterRepository.getNewsletterListByCategoryIdList(userCategoryIdList);
    const recommendedNewsletterList = this.getRandomNewsletterList(newsletterList, recommendNumber);

    const combinedNewsletterList = [...advertiseNewsletterList, ...recommendedNewsletterList];
    return new NewsletterRecommendResDto(
      combinedNewsletterList.map((newsletter) => new NewsletterResDto(newsletter)),
    );
  }

  getRandomNewsletterList(newsletters: Newsletter[], count: number): Newsletter[] {
    const shuffled = newsletters.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
