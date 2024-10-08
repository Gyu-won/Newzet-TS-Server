import { ArticleRepository } from '../repositories/articleRepository.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { ArticleResDto } from '../models/dtos/article/articleResDto.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';
import { ArticleContentResDto } from '../models/dtos/article/articleContentResDto.ts';
import { getContent } from '../../lib/storageUtils.ts';
import { Article } from '../models/entities/article.ts';
import { DailyArticleResDto } from '../models/dtos/article/dailyArticleResDto.ts';
import { ForbiddenError } from '../lib/exceptions/forbiddenError.ts';
import { ArticleShareResDto } from '../models/dtos/article/articleShareResDto.ts';

export class ArticleService {
  private readonly webArticleShareLink = 'https://app.newzet.me/article';

  private articleRepository: ArticleRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  async getArticleList(userId: string, year: number, month: number): Promise<ArticleListResDto> {
    const articleList: ArticleWithImageDao[] = await this.articleRepository.getArticleList(
      userId,
      year,
      month,
    );
    const groupedArticleByDay = this.groupArticleByDay(articleList);
    const dailyArticleList = this.mapToDailyArticleList(groupedArticleByDay);
    return new ArticleListResDto(dailyArticleList);
  }

  async addArticle(
    userId: string,
    fromName: string,
    fromDomain: string,
    title: string,
    contentUrl: string,
    maillingList: string,
  ): Promise<Article> {
    return await this.articleRepository.addArticle(
      userId,
      fromName,
      fromDomain,
      title,
      contentUrl,
      maillingList,
    );
  }

  async getArticleAndRead(articleId: string): Promise<ArticleContentResDto> {
    const article = await this.articleRepository.getArticleAndRead(articleId);
    const content = await getContent(article.content_url);
    return new ArticleContentResDto(article.title, content);
  }

  async getSharedArticle(articleId: string): Promise<ArticleContentResDto> {
    const article = await this.articleRepository.getSharedArticle(articleId);
    if (!article.is_share) {
      throw new ForbiddenError('공유가 허용되지 않음');
    }
    const content = await getContent(article.content_url);
    return new ArticleContentResDto(article.title, content);
  }

  async shareArticle(articleId: string): Promise<ArticleShareResDto> {
    const article = await this.articleRepository.shareArticle(articleId);
    const shareUrl = `${this.webLink}/${article.id}`;
    return new ArticleShareResDto(shareUrl);
  }

  private groupArticleByDay(articleList: ArticleWithImageDao[]) {
    const groupedArticleByDay: { [key: number]: ArticleResDto[] } = {};

    articleList.forEach((article) => {
      const day = new Date(article.created_at).getDate();
      if (!groupedArticleByDay[day]) {
        groupedArticleByDay[day] = [];
      }
      groupedArticleByDay[day].push(new ArticleResDto(article));
    });
    return groupedArticleByDay;
  }

  private mapToDailyArticleList(groupedArticleByDay: {
    [key: number]: ArticleResDto[];
  }): DailyArticleResDto[] {
    const dailyArticleList = Object.keys(groupedArticleByDay).map((dayStr) => {
      const day = parseInt(dayStr, 10);
      return { day: day, articleList: groupedArticleByDay[day] };
    });
    return dailyArticleList;
  }
}
