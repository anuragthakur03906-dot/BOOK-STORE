// emailService.js - utilities for sending emails (password reset, etc.)
// wraps nodemailer configuration and error handling
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('Email Configuration Check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log(' Email credentials missing in .env file!');
    throw new Error('Email credentials not configured');
  }
  
  console.log('Creating Gmail transporter...');
  
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_PASSWORD.trim()  // Spaces OK here
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send password reset email
export const sendResetPasswordEmail = async (email, token, name) => {
  try {
    console.log(`Attempting to send real email to: ${email}`);
    
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
          <style>
            /* ... your email styles ... */
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white; margin: 0;">Password Reset</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>We received a request to reset your password for your BookStore account.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
                <p>If the button doesn't work, copy and paste this link:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hello ${name},

We received a request to reset your password for your BookStore account.

Reset your password here: ${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
BookStore Team`
    };
    
    console.log('Sending email through Gmail...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log(' Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    return true;
    
  } catch (error) {
    console.error(' Email sending failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\nAUTHENTICATION ERROR - Common fixes:');
      console.log('1. Check if App Password is correct');
      console.log('2. Make sure 2-Step Verification is ON');
      console.log('3. Try generating new App Password');
      console.log('4. Check .env file for correct credentials');
    }
    
    throw error;
  }
};