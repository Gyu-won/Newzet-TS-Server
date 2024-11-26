import { ApiFactory } from 'https://deno.land/x/aws_api@v0.8.1/client/mod.ts';
import { S3 } from 'https://deno.land/x/aws_api@v0.8.1/services/s3/mod.ts';
import {
  awsS3AccessKey,
  awsS3SecretKey,
  awsMailBucket,
  awsContentBucket,
  awsRegion,
} from '../environments.ts';
import { S3AccessError } from '../api/lib/exceptions/s3AccessError.ts';
import { simpleParser, ParsedMail } from 'npm:mailparser';
import { convertToSeoulTime } from '../api/lib/utils/timezone.ts';

const S3Factory = new ApiFactory({
  region: awsRegion,
  credentials: {
    awsAccessKeyId: awsS3AccessKey,
    awsSecretKey: awsS3SecretKey,
  },
});
const awsS3 = S3Factory.makeNew(S3);

export async function getMailContent(objectKey: string): Promise<ParsedMail> {
  const responseBody = await getMailContentFromS3(objectKey);
  const decodedResponseBody = await decodeUtf8(responseBody);
  const mailContent = await simpleParser(decodedResponseBody);
  return mailContent;
}

export async function uploadContent(
  objectKey: string,
  toDomain: string,
  content: string,
): Promise<string> {
  try {
    const currentTime = calculateCurrentTime();
    const uploadKey = `${toDomain}_${currentTime}_${objectKey}`;
    await awsS3.putObject({
      Bucket: awsContentBucket,
      Key: uploadKey,
      Body: content,
      ContentType: 'text/html',
    });
    return uploadKey;
  } catch (error) {
    throw new S3AccessError(`html 파일 업로드 실패: ${error.message}`);
  }
}

export async function getContentFromS3(objectKey: string): Promise<string> {
  const responseBody = await getHtmlContent(objectKey);
  return await decodeUtf8(responseBody);
}

async function getMailContentFromS3(objectKey: string): Promise<ReadableStream> {
  const response = await awsS3.getObject({
    Bucket: awsMailBucket,
    Key: objectKey,
  });

  if (!response.Body) {
    throw new S3AccessError('S3 데이터 조회 실패');
  }

  return response.Body;
}

async function getHtmlContent(objectKey: string): Promise<ReadableStream> {
  const response = await awsS3.getObject({
    Bucket: awsContentBucket,
    Key: objectKey,
  });

  if (!response.Body) {
    throw new S3AccessError('S3 데이터 조회 실패');
  }

  return response.Body;
}

async function decodeUtf8(responseBody: ReadableStream): Promise<string> {
  const responseBodyBuffer = await new Response(responseBody).arrayBuffer();
  return new TextDecoder('utf-8').decode(responseBodyBuffer);
}

function calculateCurrentTime(): string {
  const today = convertToSeoulTime(new Date());
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}
