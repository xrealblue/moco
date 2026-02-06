import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com or your domain's SMTP
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // your email from realblue.lol
        pass: process.env.EMAIL_PASS, // your email password or app password
    },
});

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

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">MOCO</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                                ${type === 'signup' ? 'Welcome to MOCO!' : 'Login Verification'}
                            </h2>
                            
                            <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                ${type === 'signup'
                ? 'Thank you for signing up! Please use the code below to verify your email address and complete your registration.'
                : 'We received a login request for your account. Please use the code below to complete your sign-in.'}
                            </p>
                            
                            <!-- OTP Box -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px 40px; display: inline-block;">
                                            <span style="color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                ${otp}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #a0aec0; font-size: 12px; text-align: center; line-height: 1.6;">
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
        `;

        await transporter.sendMail({
            from: `"MOCO" <noreply@realblue.lol>`, // Your verified sender email
            to: email,
            subject,
            html,
        });

        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};
