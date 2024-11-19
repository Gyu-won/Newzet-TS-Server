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
    subscriptionId: string | null,
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
          subscription_id: subscriptionId,
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

  async getSharedArticle(articleId: string): Promise<Article> {
    const { data: article, error } = await supabase
      .from('article')
      .select('*')
      .eq('id', articleId)
      .single();

    if (error) {
      throw new DatabaseAccessError('공유 아티클 조회 실패', error.message);
    }
    return article;
  }

  async shareArticle(articleId: string): Promise<Article> {
    const { data: article, error } = await supabase
      .from('article')
      .update({ is_share: true })
      .eq('id', articleId)
      .select('*')
      .single();

    if (error) {
      throw new DatabaseAccessError('아티클 공유 실패', error.message);
    }
    return article;
  }

  async getLikeArticleList(userId: string): Promise<ArticleWithImageDao[]> {
    const { data: articleLikeList, error } = await supabase.rpc('get_like_article_with_image', {
      uid: userId,
    });

    if (error) {
      throw new DatabaseAccessError('좋아요 아티클 목록 조회 실패', error.message);
    }
    return articleLikeList;
  }

  async updateLikeArticle(articleId: string, isLike: boolean) {
    const { error } = await supabase
      .from('article')
      .update({ is_like: isLike })
      .eq('id', articleId);

    if (error) {
      throw new DatabaseAccessError('아티클 좋아요 값 변경 실패', error.message);
    }
  }

  async getUnreadArticleListByDate(userId: string, date: Date): Promise<Article[]> {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const { data: unreadArticleList, error } = await supabase
      .from('article')
      .select('*')
      .eq('to_user_id', userId)
      .eq('is_read', false)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());

    if (error) {
      throw new DatabaseAccessError('날짜에 따른 안읽은 아티클 조회 실패', error.message);
    }
    return unreadArticleList ?? [];
  }
}
