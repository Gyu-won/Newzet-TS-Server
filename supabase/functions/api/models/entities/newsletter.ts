import { Color } from '../../lib/enums/color.ts';

export interface Newsletter {
  id: string;
  category_id: string;
  name: string;
  description: string;
  domain: string;
  mailling_list: string;
  subscription_url: string;
  image_url: string;
  detail: string | null;
  priority: number | null;
  status: string | null;
  day_of_week: string | null;
  deleted_at: string | null;
  color: Color;
}
