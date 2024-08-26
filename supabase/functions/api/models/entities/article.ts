export interface Article {
  id: string;
  to_user_id: string;
  newsletter_id: string | null;
  from_name: string | null;
  from_domain: string;
  title: string;
  content_url: string;
  is_read: boolean;
  created_at: string;
  deleted_at: string | null;
}
