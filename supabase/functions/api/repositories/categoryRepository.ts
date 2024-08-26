import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { Category } from '../models/entities/category.ts';

export class CategoryRepository {
  async getCategoryList(): Promise<Category[]> {
    const { data: categoryList, error } = await supabase.from('category').select('*').order('id');

    if (error) {
      throw error;
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
      throw new DatabaseAccessError(`error get category by Id: ${error.message}`);
    }
    return category;
  }
}
