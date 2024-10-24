export class ArticleContentResDto {
  title: string;
  content: string;
  isLike: boolean;

  constructor(title: string, content: string, isLike: boolean) {
    this.title = title;
    this.content = content;
    this.isLike = isLike;
  }
}
