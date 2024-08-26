import { Role } from '../../lib/enums/role.ts';

export interface Userinfo {
  id: string;
  nickname: string | null;
  email: string | null;
  role: Role;
  created_at: string;
  deleted_at: string | null;
}
