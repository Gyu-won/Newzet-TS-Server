export const supabaseProjectURL = Deno.env.get('SB_PROJECT_URL')!;
export const supabaseServiceRoleKey = Deno.env.get('SB_SERVICE_ROLE_KEY')!;

export const awsRegion = Deno.env.get('AWS_REGION')!;
export const awsMailBucket = Deno.env.get('AWS_MAIL_BUCKET')!;
export const awsAccessKey = Deno.env.get('AWS_ACCESS_KEY')!;
export const awsSecretKey = Deno.env.get('AWS_SECRET_KEY')!;

export const firebaseClientEmail = Deno.env.get('FB_CLIENT_EMAIL')!;
export const firebasePrivateKey = Deno.env.get('FB_PRIVATE_KEY')!.replace(/\\n/g, '\n'); // 👈 replace 로직 추가 주의
export const firebaseProjectId = Deno.env.get('FB_PROJECT_ID')!;
