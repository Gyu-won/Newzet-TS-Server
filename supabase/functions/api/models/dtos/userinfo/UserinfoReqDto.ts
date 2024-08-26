export class UserinfoReqDto {
  nickname: string;
  email: string;
  userCategory: string[];

  constructor(nickname: string, email: string, userCategory: string[]) {
    this.nickname = nickname;
    this.email = email;
    this.userCategory = userCategory;
  }
}
