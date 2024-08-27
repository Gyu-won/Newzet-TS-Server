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
    const { fromName, fromEmail, to } = await parseEmailContent(responseBody);

    console.log('From Name:', fromName);
    console.log('From Email:', fromEmail);
    console.log('To:', to);

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
  const emailContent = new TextDecoder('utf-8').decode(
    await new Response(responseBody).arrayBuffer(),
  );

  const mimeHeaderMatch = emailContent.match(/MIME-Version:.*?\r?\n\r?\n/s);
  if (!mimeHeaderMatch) {
    throw new Error('S3 MIME 데이터 타입 에러');
  }

  const headersSection = mimeHeaderMatch[0].trim();
  const headerLines = headersSection.split(/\r?\n/);

  let from = '';
  let to = '';

  headerLines.forEach((line) => {
    if (line.startsWith('From:')) {
      from = line.replace('From:', '').trim();
    } else if (line.startsWith('To:')) {
      to = line.replace('To:', '').trim();
    }
  });

  let [fromName, fromEmail] = from.split(/(?=\s<)/);
  fromName = decodeBase64(fromName);
  fromEmail = fromEmail ? fromEmail.replace(/[<>]/g, '').trim() : '';

  return { fromName, fromEmail, to };
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
