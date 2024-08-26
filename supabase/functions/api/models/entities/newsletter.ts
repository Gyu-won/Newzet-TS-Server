export interface Newsletter {
  id: string;
  category_id: string;
  name: string;
  detail: string;
  domain: string;
  subscription_url: string;
  image_url: string | null;
  description: string | null;
  priority: number | null;
  status: string | null;
  day_of_week: string | null;
}
