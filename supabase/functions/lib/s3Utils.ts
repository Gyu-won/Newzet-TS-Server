import { ApiFactory } from 'https://deno.land/x/aws_api@v0.8.1/client/mod.ts';
import { S3 } from 'https://deno.land/x/aws_api@v0.8.1/services/s3/mod.ts';
import {
  awsMailAccessKey,
  awsMailBucket,
  awsContentBucket,
  awsRegion,
  awsMailSecretKey,
  awsContentAccessKey,
  awsContentSecretKey,
} from '../environments.ts';
import { S3AccessError } from '../api/lib/exceptions/s3AccessError.ts';
import { simpleParser, ParsedMail } from 'npm:mailparser';

const mailFactory = new ApiFactory({
  region: awsRegion,
  credentials: {
    awsAccessKeyId: awsMailAccessKey,
    awsSecretKey: awsMailSecretKey,
  },
});
const mailS3 = mailFactory.makeNew(S3);

const htmlContentFactory = new ApiFactory({
  region: awsRegion,
  credentials: {
    awsAccessKeyId: awsContentAccessKey,
    awsSecretKey: awsContentSecretKey,
  },
});
const htmlContentS3 = htmlContentFactory.makeNew(S3);

export async function getMailContent(objectKey: string): Promise<ParsedMail> {
  const responseBody = await getMailContentFromS3(objectKey);
  const decodedResponseBody = await decodeUtf8(responseBody);
  const mailContent = await simpleParser(decodedResponseBody);
  return mailContent;
}

export async function uploadContent(objectKey: string, content: string): Promise<string> {
  try {
    await htmlContentS3.putObject({
      Bucket: awsContentBucket,
      Key: objectKey,
      Body: content,
      ContentType: 'text/html',
    });
    return objectKey;
  } catch (error) {
    throw new S3AccessError(`html 파일 업로드 실패: ${error.message}`);
  }
}

export async function getContentFromS3(objectKey: string): Promise<string> {
  const responseBody = await getHtmlContent(objectKey);
  return await decodeUtf8(responseBody);
}

async function getMailContentFromS3(objectKey: string): Promise<ReadableStream> {
  const response = await mailS3.getObject({
    Bucket: awsMailBucket,
    Key: objectKey,
  });

  if (!response.Body) {
    throw new S3AccessError('S3 데이터 조회 실패');
  }

  return response.Body;
}

async function getHtmlContent(objectKey: string): Promise<ReadableStream> {
  const response = await htmlContentS3.getObject({
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
