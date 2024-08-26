import { CategoryResDto } from '../models/dtos/category/categoryResDto.ts';
import { UserinfoResDto } from '../models/dtos/userinfo/UserinfoResDto.ts';
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
}
