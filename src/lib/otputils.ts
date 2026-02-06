import { OTP } from "@/db/models/otpSchema.model";
import crypto from 'crypto';

export const generateOTP = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

export const createOTP = async (
    email: string,
    type: 'signup' | 'signin'
): Promise<string> => {
    // Delete any existing OTPs for this email and type
    await OTP.deleteMany({ email, type });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({
        email,
        otp,
        type,
        expiresAt,
    });

    return otp;
};

export const verifyOTP = async (
    email: string,
    otp: string,
    type: 'signup' | 'signin'
): Promise<{ success: boolean; message: string }> => {
    const otpRecord = await OTP.findOne({
        email,
        type,
        verified: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
        return { success: false, message: 'No OTP found. Please request a new one.' };
    }

    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (otpRecord.otp !== otp) {
        return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    otpRecord.verified = true;
    await otpRecord.save();

    return { success: true, message: 'OTP verified successfully.' };
};

export const resendOTP = async (
    email: string,
    type: 'signup' | 'signin'
): Promise<string> => {
    return await createOTP(email, type);
};

export const cleanupVerifiedOTPs = async (): Promise<void> => {
    await OTP.deleteMany({ verified: true });
};
