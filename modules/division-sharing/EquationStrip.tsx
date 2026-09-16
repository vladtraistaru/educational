import { divide } from './division';
import styles from './Activity.module.css';

interface Props {
  n: number;
  divisor: number;
  remainderWord: string;
}

export default function EquationStrip({ n, divisor, remainderWord }: Props) {
  const { quotient, remainder } = divide(n, divisor);
  return (
    <div className={styles.equationStrip} aria-live="polite">
      <p className={styles.equation}>
        {n} ÷ {divisor} = <strong>{quotient}</strong>
        {remainder > 0 && (
          <>
            {' '}
            {remainderWord} <strong>{remainder}</strong>
          </>
        )}
      </p>
      <p className={`${styles.equation} ${styles.equationLink}`}>
        {quotient} × {divisor}
        {remainder > 0 && ` + ${remainder}`} = {n}
      </p>
    </div>
  );
}
