export interface SubscriptionWithImageDaoV1 {
  newsletter_name: string;
  newsletter_domain: string;
  image_url: string;
  status: string;
  day_of_week: string;
}

export interface SubscriptionWithImageDaoV2 {
  id: string;
  newsletter_name: string;
  image_url: string;
  status: string;
  day_of_week: string;
}
