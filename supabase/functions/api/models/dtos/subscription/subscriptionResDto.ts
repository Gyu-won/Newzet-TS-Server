import { SubscriptionWithImageDao } from '../../daos/subscriptionWithImageDao.ts';

export class SubscriptionResDto {
  subscriptionId: string;
  newsletterName: string;
  newsletterImageUrl: string;
  newsletterStatus: string;
  newsletterDayOfWeek: string;

  constructor(subscription: SubscriptionWithImageDao) {
    this.subscriptionId = subscription.id;
    this.newsletterName = subscription.newsletter_name;
    this.newsletterImageUrl = subscription.image_url || '';
    this.newsletterStatus = subscription.status ?? '등록되지 않은 뉴스레터';
    this.newsletterDayOfWeek = subscription.day_of_week ?? '';
  }
}
