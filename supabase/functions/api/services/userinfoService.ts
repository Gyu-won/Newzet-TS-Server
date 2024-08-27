import { InvalidArgumentsError } from '../lib/exceptions/invalidArgumentsError.ts';
import { SupabaseError } from '../lib/exceptions/supabaseError.ts';
import { supabase } from '../lib/supabase.ts';
import { CategoryResDto } from '../models/dtos/category/categoryResDto.ts';
import { UserinfoInitResDto } from '../models/dtos/userinfo/userinfoInitResDto.ts';
import { UserinfoReqDto } from '../models/dtos/userinfo/userinfoReqDto.ts';
import { UserinfoResDto } from '../models/dtos/userinfo/userinfoResDto.ts';
import { UserCategoryRepository } from '../repositories/userCategoryRepository.ts';
import { UserinfoRepository } from '../repositories/userinfoRepository.ts';

export class UserinfoService {
  private userinfoRepository: UserinfoRepository;
  private userCategoryRepository: UserCategoryRepository;

  constructor() {
    this.userinfoRepository = new UserinfoRepository();
    this.userCategoryRepository = new UserCategoryRepository();
  }

  async getUserinfo(userId: string) {
    const userinfo = await this.userinfoRepository.getUserinfo(userId);
    const categoryList = await this.userCategoryRepository.getUserCategoryListByUserId(userId);

    const userinfoResDto = new UserinfoResDto(
      userinfo.nickname,
      userinfo.email,
      categoryList.map((category) => new CategoryResDto(category)),
    );
    return userinfoResDto;
  }

  async updateUserinfo(userId: string, userinfo: UserinfoReqDto) {
    if (userinfo.email != null) {
      const user = await this.userinfoRepository.getUserinfo(userId);
      if (user.email != null) {
        throw new InvalidArgumentsError('이미 이메일이 등록된 유저입니다.');
      }

      await this.userinfoRepository.updateEmail(userId, userinfo.email);
    }

    await this.userinfoRepository.updateNickname(userId, userinfo.nickname);
    await this.userCategoryRepository.deleteUserCategoryByUserId(userId);
    await this.userCategoryRepository.addUserCategory(userId, userinfo.userCategory);
  }

  async deleteUser(userId: string) {
    await this.userinfoRepository.updateDeletedAt(userId);

    await this.deleteAuth(userId);
  }

  async getIsInitialized(userId: string) {
    const myInfo = await this.userinfoRepository.getUserinfo(userId);

    return new UserinfoInitResDto(myInfo.email != null);
  }

  private async deleteAuth(userId: string) {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      throw new SupabaseError(`auth 삭제 실패: ${error.message}`);
    }
  }
}
