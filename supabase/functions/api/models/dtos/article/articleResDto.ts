import { ArticleWithImageDao } from '../../daos/articleWithImageDao.ts';

export class ArticleResDto {
  id: string;
  newsletterName: string;
  newsletterImgUrl: string;
  title: string;
  isRead: boolean;
  createdAt: string;

  constructor(article: ArticleWithImageDao) {
    this.id = article.id;
    this.newsletterName = article.from_name;
    this.newsletterImgUrl = article.image_url;
    this.title = article.title;
    this.isRead = article.is_read;
    this.createdAt = article.created_at;
  }
}
