import { ArticleRepository } from '../repositories/articleRepository.ts';
import { UserinfoRepository } from '../repositories/userinfoRepository.ts';
import { ArticleListResDto } from '../models/dtos/article/articleListResDto.ts';
import { ArticleResDto } from '../models/dtos/article/articleResDto.ts';
import { ArticleWithImageDao } from '../models/daos/articleWithImageDao.ts';
import { InvalidArgumentsError } from '../lib/exceptions/invalidArgumentsError.ts';
import { ArticleContentResDto } from '../models/dtos/article/articleContentResDto.ts';
import { ApiFactory } from 'https://deno.land/x/aws_api@v0.8.1/client/mod.ts';
import { S3 } from 'https://deno.land/x/aws_api@v0.8.1/services/s3/mod.ts';
import { awsAccessKey, awsMailBucket, awsRegion, awsSecretKey } from '../../environments.ts';
import { s3AccessError } from '../lib/exceptions/s3AccessError.ts';
import { simpleParser } from 'npm:mailparser';

const factory = new ApiFactory({
  region: awsRegion,
  credentials: {
    awsAccessKeyId: awsAccessKey,
    awsSecretKey: awsSecretKey,
  },
});
const s3 = factory.makeNew(S3);

export class ArticleService {
  private articleRepository: ArticleRepository;
  private userinfoRepository: UserinfoRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
    this.userinfoRepository = new UserinfoRepository();
  }

  async getArticleList(userId: string): Promise<ArticleListResDto> {
    const articleList: ArticleWithImageDao[] = await this.articleRepository.getArticleList(userId);

    const articleListDto = new ArticleListResDto(
      articleList.map((article) => new ArticleResDto(article)),
    );
    return articleListDto;
  }

  async addArticle(
    to: string,
    fromName: string,
    fromDomain: string,
    title: string,
    objectKey: string,
  ) {
    const userinfo = await this.userinfoRepository.getUserinfoByEmail(to.split('@')[0]);
    if (userinfo == null) {
      throw new InvalidArgumentsError('존재하지 않는 사용자의 메일에 메일이 도착했습니다');
    }
    await this.articleRepository.addArticle(userinfo.id, fromName, fromDomain, title, objectKey);
  }

  async getArticle(articleId: string): Promise<ArticleContentResDto> {
    const article = await this.articleRepository.getArticle(articleId);
    const mailContent = await this.getMailContentFromS3(awsMailBucket, article.object_key);
    const parsedMailContent = await simpleParser(mailContent);
    return new ArticleContentResDto(parsedMailContent.subject, parsedMailContent.html);
  }

  private async getMailContentFromS3(bucketName: string, objectKey: string) {
    const response = await s3.getObject({
      Bucket: bucketName,
      Key: objectKey,
    });

    if (!response.Body) {
      throw new s3AccessError('S3 데이터 조회 실패');
    }

    return await this.decodeUtf8(response.Body);
  }

  private async decodeUtf8(responseBody: ReadableStream): Promise<string> {
    return new TextDecoder('utf-8').decode(await new Response(responseBody).arrayBuffer());
  }
}
