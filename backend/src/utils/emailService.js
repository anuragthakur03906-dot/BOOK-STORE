/**
 * @file emailService.js
 * @description Nodemailer-based email service for transactional emails,
 * specifically password reset notifications using Gmail SMTP.
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates and returns a configured Nodemailer Gmail transporter.
 * Throws an error if email credentials are not set in the environment.
 * @returns {Object} Nodemailer transporter instance
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email credentials are not configured in environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_PASSWORD.trim()
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Sends a password reset email to the specified address.
 * @param {string} email - Recipient email address
 * @param {string} token - Password reset token
 * @param {string} name - Recipient's name for personalization
 * @returns {Promise<boolean>} Resolves to true on success
 */
export const sendResetPasswordEmail = async (email, token, name) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"BookStore" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - BookStore',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 32px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background: #10b981; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">Password Reset</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #111827;">Hello ${name},</h2>
              <p style="color: #4b5563;">We received a request to reset your password for your BookStore account.</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">
                  Reset Password
                </a>
              </div>
              <p style="color: #4b5563;">This link will expire in 1 hour.</p>
              <p style="color: #4b5563;">If you did not request this, please ignore this email.</p>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
                <p>If the button does not work, copy and paste this link into your browser:</p>
                <p><a href="${resetUrl}" style="color: #10b981;">${resetUrl}</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hello ${name},\n\nWe received a request to reset your password for your BookStore account.\n\nReset your password here: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nBookStore Team`
    };

    await transporter.sendMail(mailOptions);
    return true;

  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw error;
  }
};