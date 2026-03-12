'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFeedback(formData: FormData) {
  const message = formData.get('message') as string;
  const page = formData.get('page') as string;
  const who = formData.get('who') as string;
  const source = formData.get('source') as string;

  if (!message?.trim()) {
    return { error: 'Message is required' };
  }

  const lines = [`Page: ${page}`, '', message];
  if (who?.trim()) lines.push('', `Who: ${who}`);
  if (source?.trim()) lines.push(`Found via: ${source}`);

  const { error } = await resend.emails.send({
    from: 'Feedback <onboarding@resend.dev>',
    to: process.env.FEEDBACK_EMAIL!,
    subject: 'Feedback from Educational Platform',
    text: lines.join('\n'),
  });

  if (error) {
    return { error: 'Failed to send feedback. Please try again.' };
  }

  return { success: true };
}
