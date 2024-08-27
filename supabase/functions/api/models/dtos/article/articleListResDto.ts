import { ArticleResDto } from './articleResDto.ts';

export class ArticleListResDto {
  articleList: ArticleResDto[];

  constructor(ArticleList: ArticleResDto[]) {
    this.articleList = ArticleList;
  }
}
