import { ArticleResDto } from './articleResDto.ts';

export class ArticleLikeListResDto {
  articleLikeList: ArticleResDto[];

  constructor(articleLikeList: ArticleResDto[]) {
    this.articleLikeList = articleLikeList;
  }
}
