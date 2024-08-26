import { User as SupabaseUser } from 'https://esm.sh/v135/@supabase/auth-js@2.64.2';

export class AuthUser {
  id: string;
  createdAt: string;

  constructor(id: string, createdAt: string) {
    this.id = id;
    this.createdAt = createdAt;
  }

  static fromUser(user: SupabaseUser): AuthUser {
    return new AuthUser(user.id, user.created_at);
  }
}
