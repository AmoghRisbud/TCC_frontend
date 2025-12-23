import { NextRequest, NextResponse } from 'next/server';
import { getEmailTransporter, verifyEmailConnection } from '../../../../lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = {
      to: 'info.thecollectivecounsel@gmail.com',
      subject: `Student Inquiry: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #1a472a; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #ddd; }
              .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1a472a; margin-top: 10px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">Student Inquiry</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">The Collective Counsel Contact Form</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Student Name:</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #1a472a;">${email}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">Subject:</div>
                  <div class="value">${subject}</div>
                </div>
                
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div class="footer">
                  <p>This message was submitted through the TCC website student contact form.</p>
                  <p>Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Verify email service is available before attempting to send
    const emailServiceReady = await verifyEmailConnection();
    if (!emailServiceReady) {
      console.error('Email service unavailable - student inquiry cannot be processed');
      return NextResponse.json(
        { error: 'Email service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Send email using Nodemailer
    try {
      const transporter = getEmailTransporter();
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailContent.to,
        subject: emailContent.subject,
        html: emailContent.html,
        replyTo: email, // Allow direct reply to student
      });

      // Log successful submission
      console.log('✅ Student inquiry email sent successfully:', {
        name,
        email,
        subject,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully',
        data: { name, email },
      });

    } catch (emailError) {
      console.error('❌ Failed to send student inquiry email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later or contact us directly.' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error processing student inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
