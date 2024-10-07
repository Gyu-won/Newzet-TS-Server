export interface Article {
  id: string;
  to_user_id: string;
  from_name: string;
  from_domain: string;
  title: string;
  content_url: string;
  is_read: boolean;
  created_at: string;
  deleted_at: string | null;
  mailling_list: string | null;
  is_share: boolean;
}
