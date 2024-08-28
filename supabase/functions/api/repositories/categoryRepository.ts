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

  async getCategoryById(id: string): Promise<Category> {
    const { data: category, error } = await supabase
      .from('category')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new DatabaseAccessError('카테고리 Id로 조회 실패', error.message);
    }
    return category;
  }
}
