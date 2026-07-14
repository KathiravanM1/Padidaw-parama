import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = ({ to, subject, html }) =>
  transporter.sendMail({ from: `"Vidivu" <${process.env.MAIL_USER}>`, to, subject, html });
