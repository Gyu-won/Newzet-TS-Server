import { SubscriptionResDto } from './subscriptionResDto.ts';

export class SubscriptionListResDto {
  subscriptionList: SubscriptionResDto[];

  constructor(subscriptionList: SubscriptionResDto[]) {
    this.subscriptionList = subscriptionList;
  }
}
