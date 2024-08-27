import { Newsletter } from '../../entities/newsletter.ts';

export class NewsletterResDto {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  priority: number;

  constructor(newsletter: Newsletter) {
    this.id = newsletter.id;
    this.name = newsletter.name;
    this.imageUrl = newsletter.image_url || '';
    this.description = newsletter.description;
    this.priority = newsletter.priority || 100;
  }
}
