'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { sendFeedback } from '@/app/actions/feedback';
import styles from './FeedbackButton.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function FeedbackButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const pathname = usePathname();

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
      setTimeout(close, 1500);
    }
  };

  return (
    <>
      <button className={styles.trigger} onClick={open} aria-label="Send feedback">
        💬
      </button>

      <dialog ref={dialogRef} className={styles.dialog}>
        <article>
          <header>
            <button aria-label="Close" rel="prev" onClick={close} />
            <h3>Send Feedback</h3>
          </header>

          {status === 'sent' ? (
            <p className={styles.success}>Thanks for your feedback!</p>
          ) : (
            <form ref={formRef} action={handleSubmit}>
              <textarea
                name="message"
                placeholder="What's on your mind?"
                rows={4}
                required
                autoFocus
              />
              {status === 'error' && (
                <p className={styles.error}>Something went wrong. Please try again.</p>
              )}
              <button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </article>
      </dialog>
    </>
  );
}
