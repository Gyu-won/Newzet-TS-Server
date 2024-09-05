import { ArticleResDto } from './articleResDto.ts';

export class DailyArticleResDto {
  day: number;
  articleList: ArticleResDto[];

  constructor(day: number, ArticleList: ArticleResDto[]) {
    this.day = day;
    this.articleList = ArticleList;
  }
}
