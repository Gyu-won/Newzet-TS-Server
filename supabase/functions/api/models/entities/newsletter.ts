export interface Newsletter {
  id: string;
  category_id: string;
  name: string;
  description: string;
  domain: string;
  subscription_url: string;
  image_url: string | null;
  detail: string | null;
  priority: number | null;
  status: string | null;
  day_of_week: string | null;
}
