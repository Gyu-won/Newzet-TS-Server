import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { Userinfo } from '../models/entities/userinfo.ts';

export class UserinfoRepository {
  async getUserinfo(userId: string): Promise<Userinfo> {
    const { data: userinfo, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new DatabaseAccessError('유저 정보 조회 실패', error.message);
    }

    if (!userinfo) {
      throw new DatabaseAccessError('존재하지 않는 유저');
    }

    return userinfo;
  }
}
