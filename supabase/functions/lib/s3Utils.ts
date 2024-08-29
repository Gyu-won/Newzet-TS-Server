import { ApiFactory } from 'https://deno.land/x/aws_api@v0.8.1/client/mod.ts';
import { S3 } from 'https://deno.land/x/aws_api@v0.8.1/services/s3/mod.ts';
import { awsAccessKey, awsMailBucket, awsRegion, awsSecretKey } from '../environments.ts';
import { simpleParser, ParsedMail } from 'npm:mailparser';

const factory = new ApiFactory({
  region: awsRegion,
  credentials: {
    awsAccessKeyId: awsAccessKey,
    awsSecretKey: awsSecretKey,
  },
});
const s3 = factory.makeNew(S3);

export async function getMailContent(objectKey: string): Promise<ParsedMail> {
  const responseBody = await getMailContentFromS3(objectKey);
  const decodedResponseBody = await decodeUtf8(responseBody);
  const mailContent = await simpleParser(decodedResponseBody);
  return mailContent;
}

async function getMailContentFromS3(objectKey: string): Promise<ReadableStream> {
  const response = await s3.getObject({
    Bucket: awsMailBucket,
    Key: objectKey,
  });

  if (!response.Body) {
    throw new Error('S3 데이터 조회 실패');
  }

  return response.Body;
}

async function decodeUtf8(responseBody: ReadableStream): Promise<string> {
  const responseBodyBuffer = await new Response(responseBody).arrayBuffer();
  return new TextDecoder('utf-8').decode(responseBodyBuffer);
}
