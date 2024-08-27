import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { ArticleWithImageDo } from '../models/dos/articleWithImageDo.ts';

export class ArticleRepository {
  async getArticleList(userId: string): Promise<ArticleWithImageDo[]> {
    const { data: articleList, error } = await supabase.rpc('get_article_with_image', {
      uid: userId,
    });
    if (error) {
      throw new DatabaseAccessError('아티클 목록 조회 실패', error.message);
    }
    return articleList;
  }
}
