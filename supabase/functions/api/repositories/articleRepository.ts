import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';

export class ArticleRepository {
  async getArticleList(userId: string): Promise<ArticleWithImageDao[]> {
    const { data: articleList, error } = await supabase.rpc('get_article_with_image', {
      uid: userId,
    });
    if (error) {
      throw new DatabaseAccessError('아티클 목록 조회 실패', error.message);
    }
    return articleList;
  }

  async addArticle(
    toUserId: string,
    fromName: string,
    fromDomain: string,
    title: string,
    objectKey: string,
  ) {
    const { error: insertError } = await supabase.from('article').insert([
      {
        to_user_id: toUserId,
        from_name: fromName,
        from_domain: fromDomain,
        title: title,
        object_key: objectKey,
      },
    ]);

    if (insertError) {
      throw new DatabaseAccessError('article 추가 실패', insertError.message);
    }
  }
}
