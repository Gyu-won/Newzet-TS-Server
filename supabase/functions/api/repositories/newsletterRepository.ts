import { Newsletter } from '../models/entities/newsletter.ts';
import { supabase } from '../lib/supabase.ts';
import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';

export class NewsletterRepository {
  async getNewsletterById(newsletterId: string): Promise<Newsletter> {
    const { data: newsletter, error } = await supabase
      .from('newsletter')
      .select('*')
      .eq('id', newsletterId)
      .single();
    if (error) {
      throw new DatabaseAccessError('뉴스레터 조회 실패', error.message);
    }
    return newsletter;
  }

  async getNewsletterListByNameOrCategoryId(
    name: string | undefined,
    categoryId: string | undefined,
  ): Promise<Newsletter[]> {
    let query = supabase.from('newsletter').select('*').is('deletedAt', null);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    const { data: newsletterList, error } = await query;
    if (error) {
      throw new DatabaseAccessError('뉴스레터 목록 조회 실패', error.message);
    }
    return newsletterList;
  }

  async getNewsletterByDomain(domain: string): Promise<Newsletter | null> {
    const { data: newsletter, error } = await supabase
      .from('newsletter')
      .select('*')
      .eq('domain', domain)
      .maybeSingle();
    if (error) {
      throw new DatabaseAccessError('뉴스레터 조회 실패', error.message);
    }
    return newsletter;
  }
}
