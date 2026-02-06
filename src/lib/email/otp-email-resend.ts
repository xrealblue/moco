import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOTPEmailParams {
    email: string;
    otp: string;
    type: 'signup' | 'signin';
}

export const sendOTPEmail = async ({
    email,
    otp,
    type,
}: SendOTPEmailParams): Promise<boolean> => {
    try {
        const subject = type === 'signup'
            ? 'Verify Your Email - MOCO'
            : 'Login Verification Code - MOCO';

        const { data, error } = await resend.emails.send({
            from: 'MOCO <noreply@realblue.lol>',
            to: email,
            subject,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 16px; border: 1px solid #333;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">MOCO</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; font-weight: 600;">
                                ${type === 'signup' ? 'Welcome to MOCO!' : 'Login Verification'}
                            </h2>
                            
                            <p style="margin: 0 0 30px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                                ${type === 'signup'
                    ? 'Thank you for signing up! Please use the code below to verify your email address and complete your registration.'
                    : 'We received a login request for your account. Please use the code below to complete your sign-in.'}
                            </p>
                            
                            <!-- OTP Box -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 12px; padding: 24px 48px; display: inline-block; box-shadow: 0 8px 24px rgba(251, 191, 36, 0.3);">
                                            <span style="color: #000000; font-size: 36px; font-weight: 800; letter-spacing: 10px; font-family: 'Courier New', monospace;">
                                                ${otp}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #808080; font-size: 14px; line-height: 1.6;">
                                This code will expire in <strong style="color: #fbbf24;">10 minutes</strong>. If you didn't request this code, please ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #1a1a1a; border-radius: 0 0 16px 16px; border-top: 1px solid #333;">
                            <p style="margin: 0; color: #666; font-size: 12px; text-align: center; line-height: 1.6;">
                                This email was sent from MOCO. Please do not reply to this email.
                                <br>
                                © ${new Date().getFullYear()} MOCO. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return false;
        }

        console.log('OTP email sent successfully:', data);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

// Re-export your existing email functions
export { sendWelcomeEmail, sendNewsSummaryEmail } from '@/lib/nodemailer';