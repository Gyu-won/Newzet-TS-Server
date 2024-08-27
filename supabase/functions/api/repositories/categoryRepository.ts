import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { Category } from '../models/entities/category.ts';

export class CategoryRepository {
  async getCategoryList(): Promise<Category[]> {
    const { data: categoryList, error } = await supabase.from('category').select('*').order('id');

    if (error) {
      throw new DatabaseAccessError('카테고리 목록 조회 실패', error.message);
    }
    return categoryList as Category[];
  }
}
