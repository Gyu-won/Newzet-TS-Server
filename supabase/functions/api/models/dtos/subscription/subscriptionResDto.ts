import {
  SubscriptionWithImageDaoV1,
  SubscriptionWithImageDaoV2,
} from '../../daos/subscriptionWithImageDao.ts';

export class SubscriptionResDtoV1 {
  newsletterName: string;
  newsletterDomain: string;
  newsletterImageUrl: string;
  newsletterStatus: string;
  newsletterDayOfWeek: string;

  constructor(subscription: SubscriptionWithImageDaoV1) {
    this.newsletterName = subscription.newsletter_name;
    this.newsletterDomain = subscription.newsletter_domain;
    this.newsletterImageUrl = subscription.image_url || '';
    this.newsletterStatus = subscription.status ?? '등록되지 않은 뉴스레터';
    this.newsletterDayOfWeek = subscription.day_of_week ?? '';
  }
}

export class SubscriptionResDtoV2 {
  subscriptionId: string;
  newsletterName: string;
  newsletterImageUrl: string;
  newsletterStatus: string;
  newsletterDayOfWeek: string;

  constructor(subscription: SubscriptionWithImageDaoV2) {
    this.subscriptionId = subscription.id;
    this.newsletterName = subscription.newsletter_name;
    this.newsletterImageUrl = subscription.image_url || '';
    this.newsletterStatus = subscription.status ?? '등록되지 않은 뉴스레터';
    this.newsletterDayOfWeek = subscription.day_of_week ?? '';
  }
}
