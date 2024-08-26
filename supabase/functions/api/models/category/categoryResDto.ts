import { Category } from '../entities/category.ts';

export class CategoryResDto {
  id: string;
  name: string;
  imageUrl: string;
  emoji: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.imageUrl = category.image_url;
    this.emoji = category.emoji;
  }
}
