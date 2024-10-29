import { SubscriptionResDtoV1, SubscriptionResDtoV2 } from './subscriptionResDto.ts';

export class SubscriptionListResDtoV1 {
  subscriptionList: SubscriptionResDtoV1[];

  constructor(subscriptionList: SubscriptionResDtoV1[]) {
    this.subscriptionList = subscriptionList;
  }
}

export class SubscriptionListResDtoV2 {
  subscriptionList: SubscriptionResDtoV2[];

  constructor(subscriptionList: SubscriptionResDtoV2[]) {
    this.subscriptionList = subscriptionList;
  }
}
