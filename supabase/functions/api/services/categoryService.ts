import { CategoryListResDto } from '../models/dtos/category/categoryListResDto.ts';
import { CategoryResDto } from '../models/dtos/category/categoryResDto.ts';
import { Category } from '../models/entities/category.ts';
import { CategoryRepository } from '../repositories/categoryRepository.ts';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getCategoryList(): Promise<CategoryListResDto> {
    const categoryList: Category[] = await this.categoryRepository.getCategoryList();

    const categoryListDto = new CategoryListResDto(
      categoryList.map((category) => new CategoryResDto(category)),
    );
    return categoryListDto;
  }
}
