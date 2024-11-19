import { WidgetResDto } from '../models/dtos/widget/widgetResDto.ts';
import { ArticleRepository } from '../repositories/articleRepository.ts';
import { convertToSeoulTime } from '../lib/utils/timezone.ts';
import { Article } from '../models/entities/article.ts';
import { NewsletterRepository } from '../repositories/newsletterRepository.ts';
import { Newsletter } from '../models/entities/newsletter.ts';
import { Color } from '../lib/enums/color.ts';

export class WidgetService {
  private articleRepository: ArticleRepository;
  private newsletterRepository: NewsletterRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
    this.newsletterRepository = new NewsletterRepository();
  }

  async getWidget(userId: string): Promise<WidgetResDto | null> {
    const today = convertToSeoulTime(new Date());
    const unreadArticleList = await this.articleRepository.getUnreadArticleListByDate(
      userId,
      today,
    );

    if (unreadArticleList.length == 0) return null;
    const randomArticle = this.getRandomArticle(unreadArticleList);

    const newsletter = await this.getNewsletterByDomainOrMaillingList(
      randomArticle.from_domain,
      randomArticle.mailling_list,
    );
    return this.createWidgetResDto(randomArticle, newsletter);
  }

  async getNewsletterByDomainOrMaillingList(domain: string, maillingList: string | null) {
    return await this.newsletterRepository.getNewsletterByDomainOrMaillingList(
      domain,
      maillingList,
    );
  }

  private getRandomArticle(articleList: Article[]): Article {
    return articleList[Math.floor(Math.random() * articleList.length)];
  }

  private createWidgetResDto(article: Article, newsletter: Newsletter | null) {
    if (newsletter == null) {
      return new WidgetResDto(article.id, article.title, article.from_name, Color.DEFAULT);
    }
    const newsletterColor = this.convertToColorEnum(newsletter.color);
    return new WidgetResDto(article.id, article.title, newsletter.name, newsletterColor);
  }

  private convertToColorEnum(colorStr: string): Color {
    if (colorStr in Color) {
      return Color[colorStr as keyof typeof Color];
    }
    return Color.DEFAULT;
  }
}
