import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { Article } from '../models/entities/article.ts';

export class ArticleRepository {
  async getArticleList(userId: string): Promise<Article[]> {
    const { data: articleList, error } = await supabase
      .from('article')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new DatabaseAccessError('아티클 목록 조회 실패', error.message);
    }
    return articleList;
  }
}
