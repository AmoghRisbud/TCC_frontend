import { NextRequest, NextResponse } from 'next/server';
import { getEmailTransporter, verifyEmailConnection } from '../../../../lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { 
      name, 
      email, 
      phone, 
      institution, 
      yearOfStudy, 
      areaOfInterest, 
      motivation, 
      experience, 
      portfolio 
    } = body;

    // Validate required fields
    if (!name || !email || !institution || !motivation) {
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
      subject: `Legal Content Fellowship Application from ${name}`,
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
              .highlight { background: #e8f5e9; padding: 15px; border-radius: 4px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">Legal Content Fellowship Application</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">The Collective Counsel Community Programs</p>
              </div>
              <div class="content">
                <div class="highlight">
                  <h3 style="margin: 0 0 10px 0; color: #1a472a;">New Fellowship Application</h3>
                  <p style="margin: 0;">A student has applied for the Legal Content Fellowship program!</p>
                </div>
                
                <div class="field">
                  <div class="label">Full Name:</div>
                  <div class="value"><strong>${name}</strong></div>
                </div>
                
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #1a472a;">${email}</a></div>
                </div>
                
                ${phone ? `
                <div class="field">
                  <div class="label">Phone Number:</div>
                  <div class="value">${phone}</div>
                </div>
                ` : ''}
                
                <div class="field">
                  <div class="label">Institution/College:</div>
                  <div class="value">${institution}</div>
                </div>
                
                ${yearOfStudy ? `
                <div class="field">
                  <div class="label">Year of Study:</div>
                  <div class="value">${yearOfStudy}</div>
                </div>
                ` : ''}
                
                ${areaOfInterest ? `
                <div class="field">
                  <div class="label">Area of Interest:</div>
                  <div class="value">${areaOfInterest}</div>
                </div>
                ` : ''}
                
                <div class="field">
                  <div class="label">Why Join Fellowship:</div>
                  <div class="message-box">${motivation.replace(/\n/g, '<br>')}</div>
                </div>
                
                ${experience ? `
                <div class="field">
                  <div class="label">Previous Experience:</div>
                  <div class="message-box">${experience.replace(/\n/g, '<br>')}</div>
                </div>
                ` : ''}
                
                ${portfolio ? `
                <div class="field">
                  <div class="label">Portfolio/Work Samples:</div>
                  <div class="value"><a href="${portfolio}" style="color: #1a472a;" target="_blank">${portfolio}</a></div>
                </div>
                ` : ''}
                
                <div class="footer">
                  <p>This application was submitted through the TCC website community page.</p>
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
      console.error('Email service unavailable - fellowship application cannot be processed');
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
        replyTo: email, // Allow direct reply to applicant
      });

      // Log successful submission
      console.log('✅ Fellowship application email sent successfully:', {
        name,
        email,
        institution,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Fellowship application submitted successfully',
        data: { name, email, institution },
      });

    } catch (emailError) {
      console.error('❌ Failed to send fellowship application email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later or contact us directly.' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error processing fellowship application:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
