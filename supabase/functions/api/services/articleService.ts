import { ArticleRepository } from '../repositories/articleRepository.ts';
import { UserinfoRepository } from '../repositories/userinfoRepository.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { ArticleResDto } from '../models/dtos/article/articleResDto.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';
import { InvalidArgumentsError } from '../lib/exceptions/invalidArgumentsError.ts';

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
    const userinfo = await this.userinfoRepository.getUserinfoByEmail(to.split('@')[0]);
    if (userinfo == null || userinfo.deleted_at) {
      throw new InvalidArgumentsError('존재하지 않는 사용자의 메일에 메일이 도착했습니다');
    }
    await this.articleRepository.addArticle(userinfo.id, fromName, fromDomain, title, objectKey);
  }
}
