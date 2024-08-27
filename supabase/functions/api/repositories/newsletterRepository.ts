import { Newsletter } from '../models/entities/newsletter.ts';
import { supabase } from '../lib/supabase.ts';
import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';

export class NewsletterRepository {
  async getNewsletterListByNameOrCategoryId(
    name: string | undefined,
    categoryId: string | undefined,
  ): Promise<Newsletter[]> {
    let query = supabase.from('newsletter').select('*');

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
}
