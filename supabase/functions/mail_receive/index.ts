import { InvalidArgumentsError } from '../api/lib/exceptions/invalidArgumentsError.ts';
import { ArticleService } from '../api/services/articleService.ts';
import { FcmNotificationService } from '../api/services/fcmNotificationService.ts';
import { NewsletterService } from '../api/services/newsletterService.ts';
import { SubscriptionService } from '../api/services/subscriptionService.ts';
import { UserinfoService } from '../api/services/userinfoService.ts';
import { getMailContent, uploadContent } from '../lib/s3Utils.ts';

const userinfoService = new UserinfoService();
const articleService = new ArticleService();
const subscriptionService = new SubscriptionService();
const newsletterService = new NewsletterService();
const fcmNotificationService = new FcmNotificationService();

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const { objectKey } = await req.json();
    const mailContent = await getMailContent(objectKey);

    const fromName = mailContent.from?.value[0].name;
    const fromDomain = mailContent.from?.value[0].address;
    const toDomain = mailContent.to?.value[0].address;
    const maillingList = mailContent.headers.get('list')?.id?.name ?? null;

    const contentUrl = await uploadContent(objectKey, toDomain, mailContent.html);

    const newsletter = await newsletterService.getNewsletterByMaillingListOrDomain(
      maillingList,
      fromDomain,
    );

    const toMailList = mailContent.to?.text.split(', ');
    for (const toMail of toMailList) {
      const userinfo = await userinfoService.getUserinfoByEmail(toMail);
      const subscription = await subscriptionService.addSubscription(
        userinfo.id,
        newsletter?.name ?? fromName,
        fromDomain,
        newsletter?.mailling_list ?? maillingList,
      );
      const article = await articleService.addArticle(
        userinfo.id,
        newsletter?.name ?? fromName,
        fromDomain,
        mailContent.subject,
        contentUrl,
        newsletter?.mailling_list ?? maillingList,
        subscription?.id ?? null,
      );

      await fcmNotificationService.addFcmNotification(userinfo.id, article);
    }

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
