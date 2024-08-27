import { Subscription } from '../../entities/subscription.ts';

export class SubscriptionResDto {
  newsletterName: string;
  newsletterDomain: string;
  newsletterImageUrl: string;

  constructor(subscription: Subscription, newsletterImageUrl: string) {
    this.newsletterName = subscription.newsletter_name;
    this.newsletterDomain = subscription.newsletter_domain;
    this.newsletterImageUrl = newsletterImageUrl;
  }
}
