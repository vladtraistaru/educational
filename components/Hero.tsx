import { UI_LABELS } from '@/lib/types';
import type { Language } from '@/lib/language-config';
import styles from './Hero.module.css';

export default function Hero({ lang }: { lang: Language }) {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>{UI_LABELS[lang].heroSubtitle}</h1>
    </section>
  );
}
