import { ArticleRepository } from '../repositories/articleRepository.ts';
import { UserinfoRepository } from '../repositories/userinfoRepository.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { ArticleResDto } from '../models/dtos/article/articleResDto.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';

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
    to: string,
    fromName: string,
    fromDomain: string,
    title: string,
    objectKey: string,
  ) {
    const toUserId = this.userinfoRepository.getUserinfoByEmail(to.split('@')[0]) || '';
    await this.articleRepository.addArticle(toUserId, fromName, fromDomain, title, objectKey);
  }
}
