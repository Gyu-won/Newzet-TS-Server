import { Article } from '../../entities/article.ts';

export class ArticleResDto {
  id: string;
  newsletterName: string;
  newsletterImgUrl: string;
  title: string;
  isRead: boolean;
  createdAt: string;

  constructor(article: Article) {
    this.id = article.id;
    this.newsletterName = article.from_name;
    this.newsletterImgUrl = article.from_domain;
    this.title = article.title;
    this.isRead = article.is_read;
    this.createdAt = article.created_at;
  }
}
