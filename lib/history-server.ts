import { cookies } from 'next/headers';
import { HISTORY_COOKIE, parseHistoryCookie, type HistoryEntry } from './history-config';

export async function getHistory(): Promise<HistoryEntry[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(HISTORY_COOKIE)?.value;
  return parseHistoryCookie(raw);
}
