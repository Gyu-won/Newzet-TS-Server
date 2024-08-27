import { ApiFactory } from 'https://deno.land/x/aws_api@v0.8.1/client/mod.ts';
import { S3 } from 'https://deno.land/x/aws_api@v0.8.1/services/s3/mod.ts';
import { awsAccessKey, awsRegion, awsSecretKey } from '../environments.ts';

const factory = new ApiFactory({
  region: awsRegion,
  credentials: {
    awsAccessKeyId: awsAccessKey || '',
    awsSecretKey: awsSecretKey || '',
  },
});

const s3 = factory.makeNew(S3);

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const { bucketName, objectKey } = await req.json();
    const responseBody = await getObjectFromS3(bucketName, objectKey);

    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } catch (error) {
    console.error(error.message);
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
    });
  }
});

async function getObjectFromS3(bucketName: string, objectKey: string) {
  const response = await s3.getObject({
    Bucket: bucketName,
    Key: objectKey,
  });

  if (!response.Body) {
    throw new Error('S3 데이터 조회 실패');
  }

  return response.Body;
}
