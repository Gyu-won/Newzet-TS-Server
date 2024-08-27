import { InvalidArgumentsError } from '../lib/exceptions/invalidArgumentsError.ts';
import { CategoryResDto } from '../models/dtos/category/categoryResDto.ts';
import { UniqueMailResDto } from '../models/dtos/userinfo/uniqueMailResDto.ts';
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

  async getUserinfo(userId: string): Promise<UserinfoResDto> {
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

  async getIsInitialized(userId: string): Promise<UserinfoInitResDto> {
    const myInfo = await this.userinfoRepository.getUserinfo(userId);

    return new UserinfoInitResDto(myInfo.email != null);
  }

  async getIsUniqueMail(email: string): Promise<UniqueMailResDto> {
    try {
      const userinfo = await this.userinfoRepository.getUserinfoByEmail(email);
      if (userinfo.deleted_at) {
        return new UniqueMailResDto(false, '사용 전적이 있는 이메일입니다.');
      } else {
        return new UniqueMailResDto(false, '이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      if (!(error instanceof InvalidArgumentsError)) {
        // 존재하지 않는 유저
        return new UniqueMailResDto(true, '사용 가능한 이메일입니다.');
      } else {
        throw error;
      }
    }
  }
}
