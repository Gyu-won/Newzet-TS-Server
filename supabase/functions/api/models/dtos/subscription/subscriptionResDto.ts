import { SubscriptionWithImageDao } from '../../daos/subscriptionWithImageDao.ts';

export class SubscriptionResDto {
  newsletterName: string;
  newsletterDomain: string;
  newsletterImageUrl: string;

  constructor(subscription: SubscriptionWithImageDao) {
    this.newsletterName = subscription.newsletter_name;
    this.newsletterDomain = subscription.newsletter_domain;
    this.newsletterImageUrl = subscription.image_url || '';
  }
}
