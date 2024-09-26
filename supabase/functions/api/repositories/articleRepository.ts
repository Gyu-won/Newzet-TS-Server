import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';
import { Article } from '../models/entities/article.ts';

export class ArticleRepository {
  async getArticleList(
    userId: string,
    year: number,
    month: number,
  ): Promise<ArticleWithImageDao[]> {
    const { data: articleList, error } = await supabase.rpc('get_monthly_article_with_image', {
      uid: userId,
      year: year,
      month: month,
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
    contentUrl: string,
    maillingList: string,
  ): Promise<Article> {
    const { data: article, error: insertError } = await supabase
      .from('article')
      .insert([
        {
          to_user_id: toUserId,
          from_name: fromName,
          from_domain: fromDomain,
          title: title,
          content_url: contentUrl,
          mailling_list: maillingList,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw new DatabaseAccessError('article 추가 실패', insertError.message);
    }

    return article;
  }

  async getArticleAndRead(articleId: string): Promise<Article> {
    const { data: article, error } = await supabase
      .from('article')
      .update({ is_read: true })
      .eq('id', articleId)
      .select('*')
      .single();

    if (error) {
      throw new DatabaseAccessError('아티클 조회 실패', error.message);
    }
    return article;
  }
}
