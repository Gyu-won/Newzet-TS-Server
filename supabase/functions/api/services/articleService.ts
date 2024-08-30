import { ArticleRepository } from '../repositories/articleRepository.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { ArticleResDto } from '../models/dtos/article/articleResDto.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';
import { ArticleContentResDto } from '../models/dtos/article/articleContentResDto.ts';
import { getContent } from '../../lib/storageUtils.ts';
import { Article } from '../models/entities/article.ts';

export class ArticleService {
  private articleRepository: ArticleRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  async getArticleList(userId: string): Promise<ArticleListResDto> {
    const articleList: ArticleWithImageDao[] = await this.articleRepository.getArticleList(userId);

    const articleListDto = new ArticleListResDto(
      articleList.map((article) => new ArticleResDto(article)),
    );
    return articleListDto;
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
