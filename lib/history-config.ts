// Shared (client + server safe) parsing for the "recently played" cookie.
// Kept dependency-free (no next/headers, no DOM) so it can be imported from
// both a client component (lib/history-client.ts) and a server component
// (lib/history-server.ts) without pulling in the wrong runtime.

export const HISTORY_COOKIE = 'activity_history';
export const MAX_HISTORY_ENTRIES = 12;

export interface HistoryEntry {
  slug: string;
  visits: number;
  lastVisitedAt: number; // epoch ms
}

export function parseHistoryCookie(raw: string | undefined | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is HistoryEntry =>
          !!e &&
          typeof e.slug === 'string' &&
          typeof e.visits === 'number' &&
          typeof e.lastVisitedAt === 'number',
      )
      .sort((a, b) => b.lastVisitedAt - a.lastVisitedAt);
  } catch {
    return [];
  }
}

export function serializeHistoryCookie(entries: HistoryEntry[]): string {
  return encodeURIComponent(JSON.stringify(entries.slice(0, MAX_HISTORY_ENTRIES)));
}
