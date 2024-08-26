export class UserinfoReqDto {
  nickname: string;
  email: string | null;
  userCategory: string[];

  constructor(nickname: string, email: string | null, userCategory: string[]) {
    this.nickname = nickname;
    this.email = email;
    this.userCategory = userCategory;
  }
}
