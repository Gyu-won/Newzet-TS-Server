import { ArticleRepository } from '../repositories/articleRepository.ts';
import { UserinfoRepository } from '../repositories/userinfoRepository.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { ArticleResDto } from '../models/dtos/article/articleResDto.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';
import { ArticleContentResDto } from '../models/dtos/article/articleContentResDto.ts';
import { getMailContent } from '../../lib/s3Utils.ts';

export class ArticleService {
  private articleRepository: ArticleRepository;
  private userinfoRepository: UserinfoRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
    this.userinfoRepository = new UserinfoRepository();
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
  ) {
    await this.articleRepository.addArticle(userId, fromName, fromDomain, title, contentUrl);
  }

  async getArticleAndRead(articleId: string): Promise<ArticleContentResDto> {
    const article = await this.articleRepository.getArticleAndRead(articleId);
    const mailContent = await getMailContent(article.content_url);
    return new ArticleContentResDto(mailContent.subject, mailContent.html);
  }
}
