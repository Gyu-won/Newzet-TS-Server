import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';

export class ArticleRepository {
  async addArticle(
    toUserId: string,
    fromName: string,
    fromDomain: string,
    title: string,
    contentUrl: string,
  ) {
    const { error: insertError } = await supabase.from('article').insert([
      {
        to_user_id: toUserId,
        from_name: fromName,
        from_domain: fromDomain,
        title: title,
        content_url: contentUrl,
      },
    ]);

    if (insertError) {
      throw new DatabaseAccessError('article 추가 실패', insertError.message);
    }
  }
}
