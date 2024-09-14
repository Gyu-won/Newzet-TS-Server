import { firebaseClientEmail, firebasePrivateKey, firebaseProjectId } from '../environments.ts';
import { JWT } from 'npm:google-auth-library@9';
import { supabase } from '../api/lib/supabase.ts';

interface FcmNotificationRecord {
  id: string;
  user_id: string;
  article_id: string;
  article_created_at: string;
  article_title: string;
  newsletter_name: string;
}

interface FcmNotificationWebhookPayload {
  type: 'INSERT';
  table: string;
  record: FcmNotificationRecord;
  schema: 'public';
}

// 캐시된 액세스 토큰 및 만료 시간
let cachedAccessToken: string | null = null;
let tokenExpirationTime: number | null = null;

Deno.serve(async (req: Request): Promise<Response> => {
  const payload: FcmNotificationWebhookPayload = await req.json();

  const { data: fcmToken, error } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', payload.record.user_id);

  const completedAt = new Date().toISOString();

  if (error || !fcmToken || fcmToken.length === 0) {
    console.error('Error fetching FCM tokens:', error || 'No FCM tokens found');

    await updateNotificationResult(payload.record.id, completedAt, { NOT_EXIST_USER: [] }).catch(
      (error) => console.error('Error updating result for non-existent user:', error),
    );

    return new Response(JSON.stringify({ error: 'No FCM tokens found for the user' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  const fcmTokens = fcmToken.map((token: { fcm_token: string }) => token.fcm_token);

  try {
    const accessToken = await getAccessToken({
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey,
    });

    const notificationPromises = fcmTokens.map((token) =>
      sendNotification(token, payload.record, accessToken),
    );
    const notificationResults = await Promise.all(notificationPromises);

    const resultSummary: { [key: string]: string[] } = { SUCCESS: [] };
    notificationResults.forEach(({ fcmToken, status }) => {
      if (status === 'SUCCESS') {
        resultSummary['SUCCESS'].push(fcmToken);
      } else {
        if (!resultSummary[status]) {
          resultSummary[status] = [];
        }
        resultSummary[status].push(fcmToken);
      }
    });

    await updateNotificationResult(payload.record.id, completedAt, resultSummary);

    return new Response(JSON.stringify({ notificationResults }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending FCM messages:', error);
    await updateNotificationResult(payload.record.id, completedAt, { SEND_ERROR: [] }).catch(
      (err) => console.error('Error updating result for send error:', err),
    );
    return new Response(JSON.stringify({ error: 'Failed to send FCM messages' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

const getAccessToken = async ({
  clientEmail,
  privateKey,
}: {
  clientEmail: string;
  privateKey: string;
}) => {
  if (cachedAccessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return cachedAccessToken;
  }

  const jwtClient = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  try {
    const token = await jwtClient.authorize();
    cachedAccessToken = token.access_token!;
    tokenExpirationTime = token.expiry_date!;

    return cachedAccessToken;
  } catch (err) {
    console.error('Error getting access token:', err);
    throw err;
  }
};

// 단일 FCM 토큰에 알림 전송
const sendNotification = async (
  fcmToken: string,
  record: FcmNotificationRecord,
  accessToken: string,
): Promise<{ fcmToken: string; status: string }> => {
  try {
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${firebaseProjectId}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token: fcmToken,
            data: {
              articleId: record.article_id,
              articleCreatedAt: record.article_created_at,
            },
            notification: {
              title: record.newsletter_name,
              body: record.article_title,
            },
          },
        }),
      },
    );

    const resData = await res.json();

    if (res.status < 200 || 299 < res.status) {
      const errorCode =
        resData.error?.details?.[0]?.errorCode || resData.error?.status || 'UNKNOWN_ERROR';
      console.error('Error sending FCM message:', errorCode);
      return { fcmToken, status: errorCode };
    } else {
      return { fcmToken, status: 'SUCCESS' };
    }
  } catch (err) {
    console.error('Error sending FCM message:', err);
    return { fcmToken, status: 'SEND_ERROR' };
  }
};

// 데이터베이스에 FCM 처리 결과 업데이트
const updateNotificationResult = async (
  id: string,
  completedAt: string,
  result: { [key: string]: string[] },
) => {
  const { error } = await supabase
    .from('fcm_notifications')
    .update({ completed_at: completedAt, result: JSON.stringify(result) })
    .eq('id', id);

  if (error) {
    throw error;
  }
};
