import { ArticleRepository } from '../repositories/articleRepository.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { ArticleResDto } from '../models/dtos/article/articleResDto.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';
import { ArticleContentResDto } from '../models/dtos/article/articleContentResDto.ts';
import { getContent } from '../../lib/storageUtils.ts';
import { Article } from '../models/entities/article.ts';
import { DailyArticleResDto } from '../models/dtos/article/dailyArticleResDto.ts';

export class ArticleService {
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

    const groupedByDay: { [key: number]: ArticleResDto[] } = {};

    articleList.forEach((article) => {
      const day = new Date(article.created_at).getDate();
      if (!groupedByDay[day]) {
        groupedByDay[day] = [];
      }
      groupedByDay[day].push(new ArticleResDto(article));
    });

    const dailyArticleList: DailyArticleResDto[] = Object.keys(groupedByDay).map((dayStr) => {
      const day = parseInt(dayStr, 10);
      return { day: day, articleList: groupedByDay[day] };
    });

    return new ArticleListResDto(dailyArticleList);
  }

  async addArticle(
    userId: string,
    fromName: string,
    fromDomain: string,
    title: string,
    contentUrl: string,
  ): Promise<Article> {
    return await this.articleRepository.addArticle(userId, fromName, fromDomain, title, contentUrl);
  }

  async getArticleAndRead(articleId: string): Promise<ArticleContentResDto> {
    const article = await this.articleRepository.getArticleAndRead(articleId);
    const content = await getContent(article.content_url);
    return new ArticleContentResDto(article.title, content);
  }
}
