import { Newsletter } from '../../entities/newsletter.ts';

export class NewsletterInfoResDto {
  id: string;
  name: string;
  imageUrl: string;
  detail: string;
  status: string;
  dayOfWeek: string;
  subscriptionUrl: string;
  isSubscribing: boolean;
  categoryName: string;

  constructor(newsletter: Newsletter, isSubscribing: boolean, categoryName: string) {
    this.id = newsletter.id;
    this.name = newsletter.name;
    this.imageUrl = newsletter.image_url;
    this.detail = newsletter.detail ?? '상세 정보가 없습니다.';
    this.status = newsletter.status ?? '비정기적으로 발행';
    this.dayOfWeek = newsletter.day_of_week ?? '';
    this.subscriptionUrl = newsletter.subscription_url;
    this.isSubscribing = isSubscribing;
    this.categoryName = categoryName;
  }
}
