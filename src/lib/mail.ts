import nodemailer from 'nodemailer';
import { query } from '@/lib/db';

export interface MailConfig {
  senderEmail: string;
  receiverEmail: string;
  forceSenderName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
}

/**
 * Fetch mail config from the database (frontend_content table)
 */
export async function getMailConfig(): Promise<MailConfig | null> {
  try {
    const rows = await query<any[]>(
      'SELECT content FROM frontend_content WHERE section_id = ?',
      ['mail_config']
    );
    if (rows.length > 0) {
      const content = rows[0].content;
      // mysql2 auto-parses JSON columns, but handle string case too
      return typeof content === 'string' ? JSON.parse(content) : content;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch mail config:', error);
    return null;
  }
}

/**
 * Create a Nodemailer transporter from stored config
 */
export function createTransporter(config: MailConfig) {
  return nodemailer.createTransport({
    host: config.smtpHost || 'smtp.gmail.com',
    port: config.smtpPort || 587,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpUsername,
      pass: config.smtpPassword,
    },
  });
}

/**
 * Send an email using the stored SMTP config
 */
export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const config = await getMailConfig();
  if (!config) {
    throw new Error('Mail is not configured. Please set up SMTP in the admin dashboard.');
  }

  const transporter = createTransporter(config);

  const mailOptions = {
    from: `"${config.forceSenderName}" <${config.senderEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  };

  return transporter.sendMail(mailOptions);
}
