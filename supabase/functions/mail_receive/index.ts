import { ApiFactory } from 'https://deno.land/x/aws_api@v0.8.1/client/mod.ts';
import { S3 } from 'https://deno.land/x/aws_api@v0.8.1/services/s3/mod.ts';
import { awsAccessKey, awsMailBucket, awsRegion, awsSecretKey } from '../environments.ts';
import { ArticleService } from '../api/services/articleService.ts';
import { SupabaseError } from '../api/lib/exceptions/supabaseError.ts';

const articleService = new ArticleService();
const factory = new ApiFactory({
  region: awsRegion,
  credentials: {
    awsAccessKeyId: awsAccessKey,
    awsSecretKey: awsSecretKey,
  },
});

const s3 = factory.makeNew(S3);

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const { objectKey } = await req.json();
    const responseBody = await getObjectFromS3(awsMailBucket, objectKey);
    const { to, fromName, fromDomain, title } = await parseEmailContent(responseBody);

    await articleService.addArticle(to, fromName, fromDomain, title, objectKey);
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

async function parseEmailContent(responseBody: ReadableStream<Uint8Array>) {
  const mailContent = new TextDecoder('utf-8').decode(
    await new Response(responseBody).arrayBuffer(),
  );

  const [headerSection, bodySection] = mailContent.split(/\r?\n\r?\n/, 1);
  const mimeVersionIndex = headerSection.indexOf('MIME-Version: 1.0');
  if (mimeVersionIndex === -1) {
    throw new SupabaseError('MIME-Version 1.0이 아님');
  }

  const header = headerSection.substring(mimeVersionIndex);
  const headerLines = header.split(/\r?\n/);

  let from = '';
  let to = '';
  let title = '';

  headerLines.forEach((line) => {
    if (line.startsWith('From:')) {
      from = line.replace('From:', '').trim();
    } else if (line.startsWith('To:')) {
      to = line.replace('To:', '').trim();
    } else if (line.startsWith('Subject:')) {
      title = line.replace('Subject:', '').trim();
    }
  });

  let [fromName, fromDomain] = from.split(/(?=\s<)/);
  fromName = decodeBase64(fromName);
  fromDomain = fromDomain ? fromDomain.replace(/[<>]/g, '').trim() : '';
  title = decodeBase64(title);

  return { to, fromName, fromDomain, title };
}

function decodeBase64(encodedText: string) {
  const match = encodedText.match(/=\?UTF-8\?B\?(.+)\?=/);
  if (match) {
    const base64text = match[1];
    const decodedText = atob(base64text);
    return new TextDecoder('utf-8').decode(
      new Uint8Array([...decodedText].map((char) => char.charCodeAt(0))),
    );
  }
  return encodedText;
}
