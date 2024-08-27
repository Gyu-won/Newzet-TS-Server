import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { Subscription } from '../models/entities/subscription.ts';

export class SubscriptionRepository {
  async getIsSubscribing(userId: string, newsletterDomain: string): Promise<boolean> {
    const { data: category, error } = await supabase
      .from('subscription')
      .select('*')
      .eq('user_id', userId)
      .eq('newsletter_domain', newsletterDomain);

    if (error) {
      throw new DatabaseAccessError('구독 여부 조회 실패', error.message);
    }

    return category.length > 0;
  }

  async getSubscriptionList(userId: string): Promise<Subscription[]> {
    const { data: subscriptionList, error } = await supabase
      .from('subscription')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new DatabaseAccessError('구독 목록 조회 실패', error.message);
    }

    return subscriptionList;
  }
}
