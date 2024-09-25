import { SubscriptionListResDto } from '../models/dtos/subscription/subscriptionListResDto.ts';
import { SubscriptionResDto } from '../models/dtos/subscription/subscriptionResDto.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';
import { SubscriptionRepository } from '../repositories/subscriptionRepository.ts';

export class SubscriptionService {
  private subscriptionRepository: SubscriptionRepository;
  private newsletterRepository: NewsletterRepository;

  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
    this.newsletterRepository = new NewsletterRepository();
  }

  async getSubscriptionList(userId: string): Promise<SubscriptionListResDto> {
    const subscriptionList = await this.subscriptionRepository.getSubscriptionListWithImage(userId);

    return new SubscriptionListResDto(
      subscriptionList.map((subscription) => new SubscriptionResDto(subscription)),
    );
  }

  async addSubscription(
    userId: string,
    newsletterName: string,
    newsletterDomain: string,
    newsletterMaillingList: string,
  ) {
    const isSubscribing = await this.getIsSubscribing(
      userId,
      newsletterDomain,
      newsletterMaillingList,
    );
    const isUnique = await this.isUniqueNewsletter(newsletterDomain, newsletterMaillingList);

    if (!isSubscribing && !isUnique) {
      await this.subscriptionRepository.addSubscription(
        userId,
        newsletterName,
        newsletterDomain,
        newsletterMaillingList,
      );
    }
  }

  async getIsSubscribing(userId: string, newsletterDomain: string, newsletterMaillingList: string) {
    if (newsletterMaillingList == null) {
      return await this.subscriptionRepository.getIsSubscribingByDomain(userId, newsletterDomain);
    }
    return await this.subscriptionRepository.getIsSubscribingByMaillingList(
      userId,
      newsletterMaillingList,
    );
  }

  async isUniqueNewsletter(newsletterDomain: string, newsletterMaillingList: string) {
    const newsletter = await this.newsletterRepository.getNewsletterByDomain(newsletterDomain);
    return newsletterMaillingList == '85444.list-id.stibee.com' && newsletter == null;
  }
}
