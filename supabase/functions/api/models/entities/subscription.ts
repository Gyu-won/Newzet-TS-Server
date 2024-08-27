export interface Subscription {
  id: string;
  user_id: string;
  newsletter_name: string;
  newsletter_domain: string;
  created_at: string;
  deleted_at: string | null;
}
