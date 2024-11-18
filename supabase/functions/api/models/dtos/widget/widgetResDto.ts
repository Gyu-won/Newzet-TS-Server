import { Color } from '../../../lib/enums/color.ts';

export class WidgetResDto {
  articleId: string;
  articleTitle: string;
  newsletterName: string;
  newsletterColor: string;

  constructor(
    articleId: string,
    articleTitle: string,
    newsletterName: string,
    newsletterColor: string,
  ) {
    this.articleId = articleId;
    this.articleTitle = articleTitle;
    this.newsletterName = newsletterName;
    this.newsletterColor = newsletterColor;
  }
}
