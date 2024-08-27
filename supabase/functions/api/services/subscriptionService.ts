import { SubscriptionListResDto } from '../models/dtos/subscription/subscriptionListResDto.ts';
import { SubscriptionResDto } from '../models/dtos/subscription/subscriptionResDto.ts';
import { SubscriptionRepository } from '../repositories/subscriptionRepository.ts';

export class SubscriptionService {
  private subscriptionRepository: SubscriptionRepository;

  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
  }

  async getSubscriptionList(userId: string): Promise<SubscriptionListResDto> {
    const subscriptionList = await this.subscriptionRepository.getSubscriptionListWithImage(userId);

    return new SubscriptionListResDto(
      subscriptionList.map((subscription) => new SubscriptionResDto(subscription)),
    );
  }
}
