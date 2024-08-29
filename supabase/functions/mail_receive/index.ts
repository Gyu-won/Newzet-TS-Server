import { InvalidArgumentsError } from '../api/lib/exceptions/invalidArgumentsError.ts';
import { ArticleService } from '../api/services/articleService.ts';
import { getMailContent } from '../lib/s3Utils.ts';
import { uploadHtml } from '../lib/storageUtils.ts';

const articleService = new ArticleService();

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const { objectKey } = await req.json();
    const mailContent = await getMailContent(objectKey);

    const { fromName, fromDomain } = parseFrom(mailContent.from?.text);
    const contentUrl = await uploadHtml(objectKey, mailContent.html);

    await articleService.addArticle(
      mailContent.to?.text,
      fromName,
      fromDomain,
      mailContent.subject,
      contentUrl,
    );
    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } catch (error) {
    if (error instanceof InvalidArgumentsError) {
      return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
    }
    console.error(error.message);
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
    });
  }
});

function parseFrom(from: string) {
  const match = from.match(/(.*)\s<([^>]+)>/);

  let fromName = '';
  let fromDomain = '';

  if (match) {
    fromName = match[1].trim().replace(/^["']|["']$/g, '');
    fromDomain = match[2].trim();
  }
  return { fromName, fromDomain };
}
