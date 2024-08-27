import { ArticleRepository } from '../repositories/articleRepository.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { ArticleResDto } from '../models/dtos/article/articleResDto.ts';
import { ArticleWithImageDo } from '../models/dos/articleWithImageDo.ts';

export class ArticleService {
  private articleRepository: ArticleRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  async getArticleList(userId: string): Promise<ArticleListResDto> {
    const articleList: ArticleWithImageDo[] = await this.articleRepository.getArticleList(userId);

    const articleListDto = new ArticleListResDto(
      articleList.map((article) => new ArticleResDto(article)),
    );
    return articleListDto;
  }
}
