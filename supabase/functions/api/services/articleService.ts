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
import { SupabaseError } from '../lib/exceptions/supabaseError.ts';

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
    const encodedMailContent = await this.getMailContentFromS3(awsMailBucket, article.object_key);
    const mailContent = new TextDecoder('utf-8').decode(
      await new Response(encodedMailContent).arrayBuffer(),
    );
    const content = this.parseMailContent(mailContent);
    return new ArticleContentResDto(article.title, content);
  }

  private async getMailContentFromS3(bucketName: string, objectKey: string) {
    const response = await s3.getObject({
      Bucket: bucketName,
      Key: objectKey,
    });

    if (!response.Body) {
      throw new s3AccessError('S3 데이터 조회 실패');
    }

    return response.Body;
  }

  private parseMailContent(mailContent: string) {
    const [headerSection, bodySection] = mailContent.split(/\r?\n\r?\n/, 2);
    const mimeVersionIndex = headerSection.indexOf('MIME-Version: 1.0');
    if (mimeVersionIndex === -1) {
      throw new SupabaseError('MIME-Version 1.0이 아님');
    }

    const header = headerSection.substring(mimeVersionIndex);
    const contentType = header.split('Content-Type:')[1].trim();

    // stibee도 multipart로 오는데 multipart 아닌게 뭐가 있을까?
    const boundary = this.extractBoundary(contentType);
    return this.extractHtmlContent(bodySection, boundary);
  }

  private extractBoundary(contentType: string): string {
    const boundaryMatch = contentType.match(/boundary="([^"]+)"/);
    if (!boundaryMatch) {
      throw new SupabaseError('multipart에 Boundary 필드 없음 에러');
    }
    return boundaryMatch[1];
  }

  private extractHtmlContent(bodySection: string, boundary: string): string {
    const parts = bodySection.split(`--${boundary}`);
    let content = '';

    for (const part of parts) {
      const contentTypeMatch = part.match(/Content-Type:\s*([^;\r\n]+)/);
      if (contentTypeMatch) {
        const partContentType = contentTypeMatch[1].trim();
        if (partContentType === 'text/html') {
          const htmlPart = part
            .split(/\r?\n\r?\n/)
            .slice(1)
            .join('\r\n\r\n')
            .trim();
          content += this.decodeMessageBody(htmlPart);
        }
      }
    }
    return content;
  }

  private decodeMessageBody(messageBody: string): string {
    const bodyData: string = messageBody.replace(/-/g, '+').replace(/_/g, '/');
    return this.decodeBase64(bodyData);
  }

  private decodeBase64(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }
}
