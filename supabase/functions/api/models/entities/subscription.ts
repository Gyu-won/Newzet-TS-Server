export interface Subscription {
  id: string;
  user_id: string;
  newsletter_id: string | null;
  newsletter_name: string;
  newsletter_domain: string;
  created_at: string;
  deleted_at: string | null;
}
