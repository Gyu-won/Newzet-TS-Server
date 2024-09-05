import { DailyArticleResDto } from './dailyArticleResDto.ts';

export class ArticleListResDto {
  dailyArticleList: DailyArticleResDto[];

  constructor(dailyArticleList: DailyArticleResDto[]) {
    this.dailyArticleList = dailyArticleList;
  }
}
