import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { Category } from '../models/entities/category.ts';

export class UserCategoryRepository {
  async getUserCategoryListByUserId(userId: string): Promise<Category[]> {
    const { data: categoryList, error } = await supabase
      .from('user_category')
      .select(`category(*)`)
      .eq('user_id', userId);

    if (error) {
      throw new DatabaseAccessError(`error get user_category list by userId: ${error.message}`);
    }
    // deno-lint-ignore no-explicit-any
    return categoryList.map((item: any) => item.category);
  }
}
