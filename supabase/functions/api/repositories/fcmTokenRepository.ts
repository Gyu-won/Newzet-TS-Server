import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';

export class FcmTokenRepository {
  async addFCMToken(userId: string, fcmToken: string) {
    const { data: existingToken, error: selectError } = await supabase
      .from('fcm_tokens')
      .select('*')
      .eq('fcm_token', fcmToken)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw new DatabaseAccessError('FCM token 조회 실패', selectError.message);
    }

    if (existingToken) {
      // 동일한 fcmToken이 존재하면 user_id를 업데이트
      const { error: updateError } = await supabase
        .from('fcm_tokens')
        .update({ user_id: userId })
        .eq('fcm_token', fcmToken);

      if (updateError) {
        throw new DatabaseAccessError('FCM token 업데이트 실패', updateError.message);
      }
    } else {
      // 동일한 fcmToken이 없으면 새로운 행 추가
      const { error: insertError } = await supabase
        .from('fcm_tokens')
        .insert([{ user_id: userId, fcm_token: fcmToken }]);

      if (insertError) {
        throw new DatabaseAccessError('FCM token 생성 실패', insertError.message);
      }
    }
  }

  async deleteFCMToken(userID: string, fcmToken: string) {
    const { error: deleteError } = await supabase
      .from('fcm_tokens')
      .delete()
      .eq('user_id', userID)
      .eq('fcm_token', fcmToken);

    if (deleteError) {
      throw new DatabaseAccessError('FCM token 삭제 실패', deleteError.message);
    }
  }
}
