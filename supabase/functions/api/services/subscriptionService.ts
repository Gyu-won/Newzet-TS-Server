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
    const isSubscribing = await this.subscriptionRepository.getIsSubscribing(
      userId,
      newsletterDomain,
      newsletterMaillingList,
    );

    if (!isSubscribing && newsletterMaillingList != '85444.list-id.stibee.com') {
      await this.subscriptionRepository.addSubscription(
        userId,
        newsletterName,
        newsletterDomain,
        newsletterMaillingList,
      );
    }
  }
}
