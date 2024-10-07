import { ArticleRepository } from '../repositories/articleRepository.ts';
import { FcmNotificationsRepository } from '../repositories/fcmNotificationRepository.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';
import { SubscriptionRepository } from '../repositories/subscriptionRepository.ts';
import { UserinfoRepository } from '../repositories/userinfoRepository.ts';

export class WelcomeService {
  private userinfoRepository: UserinfoRepository;
  private newsletterRepository: NewsletterRepository;
  private articleRepository: ArticleRepository;
  private subscriptionRepository: SubscriptionRepository;
  private fcmNotificationRepository: FcmNotificationsRepository;

  constructor() {
    this.userinfoRepository = new UserinfoRepository();
    this.newsletterRepository = new NewsletterRepository();
    this.articleRepository = new ArticleRepository();
    this.subscriptionRepository = new SubscriptionRepository();
    this.fcmNotificationRepository = new FcmNotificationsRepository();
  }

  async sendWelcomeMail(userId: string) {
    const userinfo = await this.userinfoRepository.getUserinfo(userId);
    const newsletter = await this.newsletterRepository.getNewsletterById(
      'c4922e54-f58a-4270-80da-2dc6d59bc4fa',
    );
    const article = await this.articleRepository.addArticle(
      userinfo.id,
      newsletter.name,
      newsletter.domain,
      '💌 뉴젯과 더욱 친해지는 방법 💌',
      'welcome_mail.html',
      newsletter.mailling_list,
    );
    await this.subscriptionRepository.addSubscription(
      userinfo.id,
      newsletter.name,
      newsletter.domain,
      newsletter.mailling_list,
    );

    await this.fcmNotificationRepository.addFcmNotification(
      userinfo.id,
      article.id,
      article.title,
      article.from_name,
      article.created_at,
    );
  }
}
