import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';

export class FcmNotificationsRepository {
  async addFcmNotification(
    userId: string,
    articleId: string,
    articleTitle: string,
    newsletterName: string,
    articleCreatedAt: string,
  ) {
    const { error: insertError } = await supabase.from('fcm_notifications').insert([
      {
        user_id: userId,
        article_id: articleId,
        article_title: articleTitle,
        newsletter_name: newsletterName,
        article_created_at: articleCreatedAt,
      },
    ]);

    if (insertError) {
      throw new DatabaseAccessError('fcm_notification 추가 실패', insertError.message);
    }
  }
}
