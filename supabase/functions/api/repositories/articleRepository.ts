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
}
