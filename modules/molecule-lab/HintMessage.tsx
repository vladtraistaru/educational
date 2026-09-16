import { useLanguage } from '@/lib/language';
import { compositionEntries, type CompositionDiff } from '@/lib/science/chemistry';
import AtomToken from './AtomToken';
import translations from './translations';
import styles from './Activity.module.css';

interface HintMessageProps {
  title: string;
  diff: CompositionDiff;
}

function HintRow({ label, entries }: { label: string; entries: ReturnType<typeof compositionEntries> }) {
  if (entries.length === 0) return null;
  return (
    <p className={styles.hintRow}>
      {label}:
      {entries.map(([symbol, count]) => (
        <span key={symbol} className={styles.hintItem}>
          {count} × <AtomToken symbol={symbol} size="small" showHands={false} />
        </span>
      ))}
    </p>
  );
}

export default function HintMessage({ title, diff }: HintMessageProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.hint} aria-live="polite">
      <p className={styles.hintTitle}>{title}</p>
      <HintRow label={t.tryAdding} entries={compositionEntries(diff.missing)} />
      <HintRow label={t.tryRemoving} entries={compositionEntries(diff.extra)} />
    </div>
  );
}
