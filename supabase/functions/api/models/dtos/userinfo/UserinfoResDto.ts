import { CategoryResDto } from '../category/categoryResDto.ts';

export class UserinfoResDto {
  nickname: string | null;
  email: string | null;
  categoryList: CategoryResDto[];

  constructor(nickname: string | null, email: string | null, categoryList: CategoryResDto[]) {
    this.nickname = nickname;
    this.email = email;
    this.categoryList = categoryList;
  }
}
