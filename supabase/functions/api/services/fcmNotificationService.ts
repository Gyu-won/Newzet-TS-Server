import { Article } from '../models/entities/article.ts';
import { FcmNotificationsRepository } from '../repositories/fcmNotificationRepository.ts';

export class FcmNotificationService {
  private fcmNotificationRepository: FcmNotificationsRepository;

  constructor() {
    this.fcmNotificationRepository = new FcmNotificationsRepository();
  }

  async addFcmNotification(userId: string, article: Article): Promise<void> {
    await this.fcmNotificationRepository.addFcmNotification(
      userId,
      article.id,
      article.title,
      article.from_name,
    );
  }
}
