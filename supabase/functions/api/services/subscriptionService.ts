import { ForbiddenError } from '../lib/exceptions/forbiddenError.ts';
import {
  SubscriptionListResDtoV1,
  SubscriptionListResDtoV2,
} from '../models/dtos/subscription/subscriptionListResDto.ts';
import {
  SubscriptionResDtoV1,
  SubscriptionResDtoV2,
} from '../models/dtos/subscription/subscriptionResDto.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';
import { SubscriptionRepository } from '../repositories/subscriptionRepository.ts';
import { Subscription } from '../models/entities/subscription.ts';

export class SubscriptionService {
  private subscriptionRepository: SubscriptionRepository;
  private newsletterRepository: NewsletterRepository;

  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
    this.newsletterRepository = new NewsletterRepository();
  }

  async getSubscriptionListV1(userId: string): Promise<SubscriptionListResDtoV1> {
    const subscriptionList =
      await this.subscriptionRepository.getSubscriptionListWithImageV1(userId);

    return new SubscriptionListResDtoV1(
      subscriptionList.map((subscription) => new SubscriptionResDtoV1(subscription)),
    );
  }

  async getSubscriptionListV2(userId: string): Promise<SubscriptionListResDtoV2> {
    const subscriptionList =
      await this.subscriptionRepository.getSubscriptionListWithImageV2(userId);

    return new SubscriptionListResDtoV2(
      subscriptionList.map((subscription) => new SubscriptionResDtoV2(subscription)),
    );
  }

  async getSubscriptionByDomainOrMaillingList(
    userId: string,
    newsletterDomain: string,
    newsletterMaillingList: string,
  ) {
    const subscription = await this.subscriptionRepository.getSubscriptionByDomainOrMaillingList(
      userId,
      newsletterDomain,
      newsletterMaillingList,
    );
    return subscription;
  }

  async addSubscription(
    userId: string,
    newsletterName: string,
    newsletterDomain: string,
    newsletterMaillingList: string,
  ): Promise<Subscription> {
    return await this.subscriptionRepository.addSubscription(
      userId,
      newsletterName,
      newsletterDomain,
      newsletterMaillingList,
    );
  }

  async deleteSubscription(userId: string, subscriptionId: string) {
    const isUserSubscription = await this.subscriptionRepository.getIsUserSubscription(
      userId,
      subscriptionId,
    );
    if (!isUserSubscription) {
      throw new ForbiddenError();
    }
    await this.subscriptionRepository.deleteSubscription(subscriptionId);
  }
}
