'use client';

import styles from './Activity.module.css';

interface NameChoicesProps {
  choices: string[];
  answer: string;
  picked: string | null;
  onPick: (choice: string) => void;
}

export default function NameChoices({ choices, answer, picked, onPick }: NameChoicesProps) {
  const answered = picked !== null;
  return (
    <div className={styles.choices}>
      {choices.map((choice) => {
        let state = '';
        if (answered && choice === answer) state = styles.choiceCorrect;
        else if (choice === picked) state = styles.choiceWrong;
        return (
          <button
            key={choice}
            type="button"
            className={`${styles.choice} ${state}`}
            disabled={answered}
            onClick={() => onPick(choice)}
          >
            {choice}
          </button>
        );
      })}
    </div>
  );
}
