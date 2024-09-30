import { DatabaseAccessError } from '../lib/exceptions/databaseAccessError.ts';
import { supabase } from '../lib/supabase.ts';
import { EventBanner } from '../models/entities/eventBanner.ts';

export class EventRepository {
  async getEventList(): Promise<EventBanner[]> {
    const currentTime = new Date().toISOString();
    const { data: eventList, error } = await supabase
      .from('event_banner')
      .select('*')
      .gt('post_end', currentTime)
      .lt('post_start', currentTime);

    if (error) {
      throw new DatabaseAccessError('이벤트 배너 목록 조회 실패', error.message);
    }
    return eventList as EventBanner[];
  }
}
