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
      throw new DatabaseAccessError(`error get user_category list by userId`, error.message);
    }
    // deno-lint-ignore no-explicit-any
    return categoryList.map((item: any) => item.category);
  }

  async deleteUserCategoryByUserId(userId: string) {
    const { error: deleteError } = await supabase
      .from('user_category')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      throw new DatabaseAccessError('유저 관심 카테고리 삭제 실패', deleteError.message);
    }
  }

  async addUserCategory(userId: string, categories: string[]) {
    const userCategories = categories.map((categoryId) => ({
      user_id: userId,
      category_id: categoryId,
    }));

    const { error: insertError } = await supabase.from('user_category').insert(userCategories);

    if (insertError) {
      throw new DatabaseAccessError('유저 관심 카테고리 생성 실패', insertError.message);
    }
  }
}
