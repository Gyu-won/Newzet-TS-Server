import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { SubscriptionWithImageDao } from '../models/daos/subscriptionWithImageDao.ts';

export class SubscriptionRepository {
  async getIsSubscribingByDomain(userId: string, newsletterDomain: string): Promise<boolean> {
    const { data: subscribing, error } = await supabase
      .from('subscription')
      .select('*')
      .eq('user_id', userId)
      .eq('newsletter_domain', newsletterDomain);

    if (error) {
      throw new DatabaseAccessError('구독 여부 조회 실패', error.message);
    }

    return subscribing.length > 0;
  }

  async getIsSubscribingByMaillingList(
    userId: string,
    newsletterMaillingList: string,
  ): Promise<boolean> {
    const { data: subscribing, error } = await supabase
      .from('subscription')
      .select('*')
      .eq('user_id', userId)
      .eq('newsletter_mailling_list', newsletterMaillingList);

    if (error) {
      throw new DatabaseAccessError('구독 여부 조회 실패', error.message);
    }

    return subscribing.length > 0;
  }

  async getSubscriptionListWithImage(userId: string): Promise<SubscriptionWithImageDao[]> {
    const { data: subscriptionList, error } = await supabase.rpc('get_subscription_with_image', {
      uid: userId,
    });

    if (error) {
      throw new DatabaseAccessError(`구독 목록 조회 실패: ${error.message}`);
    }

    return subscriptionList;
  }

  async addSubscription(
    userId: string,
    newsletterName: string,
    newsletterDomain: string,
    newsletterMaillingList: string,
  ) {
    const { error: insertError } = await supabase.from('subscription').insert([
      {
        user_id: userId,
        newsletter_name: newsletterName,
        newsletter_domain: newsletterDomain,
        mailling_list: newsletterMaillingList,
      },
    ]);

    if (insertError) {
      throw new DatabaseAccessError('subscription 추가 실패', insertError.message);
    }
  }
}
