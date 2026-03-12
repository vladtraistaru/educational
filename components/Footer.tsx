'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language';
import { UI_LABELS } from '@/lib/types';
import { sendFeedback } from '@/app/actions/feedback';
import styles from './Footer.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Footer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const pathname = usePathname();
  const { language } = useLanguage();
  const ui = UI_LABELS[language];

  const open = () => {
    setStatus('idle');
    dialogRef.current?.showModal();
  };

  const close = () => {
    dialogRef.current?.close();
    formRef.current?.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    setStatus('sending');
    formData.set('page', pathname);
    const result = await sendFeedback(formData);

    if (result.error) {
      setStatus('error');
    } else {
      setStatus('sent');
      formRef.current?.reset();
      setTimeout(close, 2000);
    }
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className="container">
          <p>{ui.footerOpenSource}</p>
          <p>
            <a
              href="https://github.com/vladtraistaru/educational"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ui.footerSourceCode}
            </a>
            <span className={styles.separator}>·</span>
            <button className={styles.feedbackLink} onClick={open}>
              {ui.sendFeedback}
            </button>
          </p>
        </div>
      </footer>

      <dialog ref={dialogRef} className={styles.dialog}>
        <article>
          <header>
            <button aria-label="Close" rel="prev" onClick={close} />
            <h3>{ui.feedbackTitle}</h3>
          </header>

          {status === 'sent' ? (
            <p className={styles.success}>{ui.feedbackThanks}</p>
          ) : (
            <form ref={formRef} action={handleSubmit}>
              <p className={styles.hint}>{ui.feedbackHint}</p>

              <textarea
                name="message"
                placeholder={ui.feedbackPlaceholder}
                rows={4}
                required
                autoFocus
              />

              <details className={styles.optional}>
                <summary>{ui.feedbackAboutYou}</summary>
                <label>
                  {ui.feedbackWho}
                  <input type="text" name="who" placeholder={ui.feedbackWhoPlaceholder} />
                </label>
                <label>
                  {ui.feedbackSource}
                  <input type="text" name="source" placeholder={ui.feedbackSourcePlaceholder} />
                </label>
              </details>

              {status === 'error' && (
                <p className={styles.error}>{ui.feedbackError}</p>
              )}
              <button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? ui.feedbackSending : ui.feedbackSend}
              </button>
            </form>
          )}
        </article>
      </dialog>
    </>
  );
}
