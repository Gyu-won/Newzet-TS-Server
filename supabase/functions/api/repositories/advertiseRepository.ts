import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { Advertise } from '../models/entities/advertise.ts';

export class AdvertiseRepository {
  async getAdvertiseNewsletterIdList(): Promise<Advertise[]> {
    const { data: newsletterIdList, error } = await supabase.from('advertise').select();

    if (error) {
      throw new DatabaseAccessError('아티클 목록 조회 실패', error.message);
    }
    return newsletterIdList;
  }
}
