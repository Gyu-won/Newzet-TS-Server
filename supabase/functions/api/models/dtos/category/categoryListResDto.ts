import { CategoryResDto } from './categoryResDto.ts';

export class CategoryListResDto {
  categoryList: CategoryResDto[];

  constructor(categoryList: CategoryResDto[]) {
    this.categoryList = categoryList;
  }
}
