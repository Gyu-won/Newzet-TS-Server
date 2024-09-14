import { InvalidArgumentsError } from '../api/lib/exceptions/invalidArgumentsError.ts';
import { ArticleService } from '../api/services/articleService.ts';
import { FcmNotificationService } from '../api/services/fcmNotificationService.ts';
import { NewsletterService } from '../api/services/newsletterService.ts';
import { SubscriptionService } from '../api/services/subscriptionService.ts';
import { UserinfoService } from '../api/services/userinfoService.ts';
import { getMailContent } from '../lib/s3Utils.ts';
import { uploadContent } from '../lib/storageUtils.ts';

const userinfoService = new UserinfoService();
const articleService = new ArticleService();
const subscriptionService = new SubscriptionService();
const newsletterService = new NewsletterService();
const fcmNotificationService = new FcmNotificationService();

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const { objectKey } = await req.json();
    const mailContent = await getMailContent(objectKey);

    const { fromName, fromDomain } = parseFrom(mailContent.from?.text);
    const contentUrl = await uploadContent(objectKey, mailContent.html);

    const userinfo = await userinfoService.getUserinfoByEmail(mailContent.to?.text);
    const newsletter = await newsletterService.getNewsletterByDomain(fromDomain);

    const article = await articleService.addArticle(
      userinfo.id,
      newsletter?.name ?? fromName,
      fromDomain,
      mailContent.subject,
      contentUrl,
    );
    await subscriptionService.addSubscription(
      userinfo.id,
      newsletter?.name ?? fromName,
      fromDomain,
    );
    await fcmNotificationService.addFcmNotification(userinfo.id, article);

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
  const match = from.match(/"?([^"]*)"?\s*<([^>]+)>/);

  let fromName = from;
  let fromDomain = from;

  if (match) {
    fromName = match[1]?.trim() || '';
    fromDomain = match[2]?.trim() || '';

    if (/^=\?/.test(fromName)) {
      fromName = decodeRFC2047(fromName);
    }
  }
  return { fromName, fromDomain };
}

function decodeRFC2047(encodedStr: string) {
  const base64Pattern = /=\?UTF-8\?B\?(.+)\?=/i;
  const match = encodedStr.match(base64Pattern);
  if (match) {
    return Buffer.from(match[1], 'base64').toString('utf-8');
  }
  return encodedStr;
}
