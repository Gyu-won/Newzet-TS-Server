import { ArticleRepository } from '../repositories/articleRepository.ts';
import { UserinfoRepository } from '../repositories/userinfoRepository.ts';

export class ArticleService {
  private articleRepository: ArticleRepository;
  private userInfoRepository: UserinfoRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
    this.userInfoRepository = new UserinfoRepository();
  }

  async addArticle(
    to: string,
    fromName: string,
    fromDomain: string,
    title: string,
    objectKey: string,
  ) {
    const toUserId = this.userInfoRepository.getUserinfoByEmail(to.split('@')[0]);
    await this.articleRepository.addArticle(toUserId, fromName, fromDomain, title, objectKey);
  }
}
