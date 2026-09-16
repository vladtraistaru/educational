import { UI_LABELS } from '@/lib/types';
import type { Language } from '@/lib/language-config';
import styles from './Hero.module.css';

interface Props {
  lang: Language;
  moduleCount: number;
  subjectCount: number;
}

export default function Hero({ lang, moduleCount, subjectCount }: Props) {
  const ui = UI_LABELS[lang];
  const countText = ui.activityCount
    .replace('{count}', String(moduleCount))
    .replace('{subjects}', String(subjectCount));

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>{ui.heroTitle}</h1>
      <p className={styles.subtitle}>{ui.heroSubtitle}</p>
      <p className={styles.count}>{countText}</p>
    </section>
  );
}
