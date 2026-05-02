'use client';

import shared from '@/modules/activity.module.css';
import styles from './Activity.module.css';

interface AllerIntroProps {
  badge: string;
  body: string;
  continueLabel: string;
  onContinue: () => void;
}

export default function AllerIntro({
  badge,
  body,
  continueLabel,
  onContinue,
}: AllerIntroProps) {
  return (
    <div className={styles.allerIntro}>
      <span className={styles.allerBadge}>{badge}</span>
      <p className={styles.allerBody}>{body}</p>
      <button type="button" className={shared.btnPrimary} onClick={onContinue}>
        {continueLabel}
      </button>
    </div>
  );
}
