import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { InvalidArgumentsError } from '../lib/exceptions/invalidArgumentsError.ts';
import { supabase } from '../lib/supabase.ts';
import { Userinfo } from '../models/entities/userinfo.ts';

export class UserinfoRepository {
  async getUserinfo(userId: string): Promise<Userinfo> {
    const { data: userinfo, error } = await supabase
      .from('userinfo')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new DatabaseAccessError('유저 정보 조회 실패', error.message);
    }

    if (!userinfo) {
      throw new InvalidArgumentsError('존재하지 않는 유저');
    }

    return userinfo;
  }

  async updateEmail(userId: string, email: string) {
    const { error } = await supabase.from('userinfo').update({ email }).eq('id', userId);

    if (error) {
      throw new DatabaseAccessError('유저 이메일 등록 실패', error.message);
    }
  }

  async updateNickname(userId: string, nickname: string) {
    const { error } = await supabase.from('userinfo').update({ nickname }).eq('id', userId);

    if (error) {
      throw new DatabaseAccessError('유저 닉네임 변경 실패', error.message);
    }
  }

  async getUserinfoByEmail(email: string): Promise<Userinfo | null> {
    const { data: userinfo, error } = await supabase
      .from('userinfo')
      .select('*')
      .eq('email', `${email}@newzet.me`)
      .maybeSingle();

    if (error) {
      throw new DatabaseAccessError('유저 정보 조회 실패', error.message);
    }

    return userinfo;
  }
}
