import { supabase } from '../api/lib/supabase.ts';
import { StorageAccessError } from '../api/lib/exceptions/storageAccessError.ts';
import { mailStorage } from '../environments.ts';

export async function uploadHtml(objectKey: string, html: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(mailStorage)
    .upload(`${objectKey}.html`, html, { upsert: true });

  if (error) {
    throw new StorageAccessError(`html 파일 업로드 실패: ${error.message}`);
  }

  return data.path;
}

export async function getContent(contentUrl: string): Promise<string> {
  const { data, error } = await supabase.storage.from(mailStorage).download(contentUrl);

  if (error) {
    throw new StorageAccessError(`mail content 조회 실패: ${error.message}`);
  }

  return await data.text();
}
