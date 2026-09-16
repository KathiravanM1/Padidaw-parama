import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = ({ to, subject, html }) =>
  resend.emails.send({ from: process.env.MAIL_FROM, to, subject, html });
