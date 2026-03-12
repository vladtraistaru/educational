'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFeedback(formData: FormData) {
  const message = formData.get('message') as string;
  const page = formData.get('page') as string;

  if (!message?.trim()) {
    return { error: 'Message is required' };
  }

  const { error } = await resend.emails.send({
    from: 'Feedback <onboarding@resend.dev>',
    to: process.env.FEEDBACK_EMAIL!,
    subject: `Feedback from Educational Platform`,
    text: `Page: ${page}\n\n${message}`,
  });

  if (error) {
    return { error: 'Failed to send feedback. Please try again.' };
  }

  return { success: true };
}
