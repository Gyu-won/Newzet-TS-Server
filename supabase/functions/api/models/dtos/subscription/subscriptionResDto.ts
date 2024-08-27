import { SubscriptionWithImageDo } from '../../dos/subscriptionWithImageDo.ts';

export class SubscriptionResDto {
  newsletterName: string;
  newsletterDomain: string;
  newsletterImageUrl: string;

  constructor(subscription: SubscriptionWithImageDo) {
    this.newsletterName = subscription.newsletter_name;
    this.newsletterDomain = subscription.newsletter_domain;
    this.newsletterImageUrl = subscription.image_url || '';
  }
}
