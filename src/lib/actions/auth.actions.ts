'use server'

import { headers } from "next/headers"
import { auth } from "../better-auth/auth"
import { inngest } from "../inngest/client"

import { sendOTPEmail } from "../nodemailer/otp"
import { connectToDatabase } from "@/db/mongoose"
import { createOTP, resendOTP, verifyOTP } from "../otputils"

export const signUpWithEmail = async ({
    email,
    password,
    fullName,
    country,
    investmentGoals,
    riskTolerance,
    preferredIndustry
}: SignUpFormData) => {
    try {
        await connectToDatabase();

        // First create the user account with Better Auth
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
            }
        })

        if (!response) {
            return { success: false, message: 'Sign-up failed. Please try again.' }
        }

        // Generate and send OTP
        const otp = await createOTP(email, 'signup');
        const emailSent = await sendOTPEmail({ email, otp, type: 'signup' });

        if (!emailSent) {
            return {
                success: false,
                message: 'Account created but failed to send verification email. Please try again.'
            };
        }

        // Store user data temporarily for after verification
        // You might want to store this in a temporary collection or session
        // For now, we'll send it via Inngest after OTP verification

        return {
            success: true,
            message: 'Account created! Please check your email for verification code.',
            requiresOTP: true,
            data: { email, fullName, country, investmentGoals, riskTolerance, preferredIndustry }
        };
    } catch (error) {
        console.error("Error during sign-up:", error)
        return { success: false, message: 'Sign-up failed. Please try again.' }
    }
}

/**
 * Step 2: Verify OTP after signup
 */
export const verifySignUpOTP = async (
    email: string,
    otp: string,
    userData: {
        fullName: string;
        country: string;
        investmentGoals: string;
        riskTolerance: string;
        preferredIndustry: string;
    }
) => {
    try {
        await connectToDatabase();

        const verification = await verifyOTP(email, otp, 'signup');

        if (!verification.success) {
            return verification;
        }

        // OTP verified successfully, now trigger welcome email
        try {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: userData.fullName,
                    country: userData.country,
                    investmentGoals: userData.investmentGoals,
                    riskTolerance: userData.riskTolerance,
                    preferredIndustry: userData.preferredIndustry
                }
            });
        } catch (evErr) {
            console.error('Inngest event send failed:', evErr);
        }

        return {
            success: true,
            message: 'Email verified successfully! You can now sign in.'
        };
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, message: 'Verification failed. Please try again.' };
    }
}

/**
 * Step 1: Sign In - Send OTP instead of direct login
 */
export const signInWithEmail = async ({
    email,
    password,
}: SignInFormData) => {
    try {
        await connectToDatabase();

        // First verify credentials with Better Auth
        // Note: Better Auth will validate but we won't complete the session yet
        const response = await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })

        if (!response) {
            return { success: false, message: 'Invalid email or password.' }
        }

        // Generate and send OTP
        const otp = await createOTP(email, 'signin');
        const emailSent = await sendOTPEmail({ email, otp, type: 'signin' });

        if (!emailSent) {
            return {
                success: false,
                message: 'Failed to send verification code. Please try again.'
            };
        }

        return {
            success: true,
            message: 'Verification code sent to your email!',
            requiresOTP: true,
            data: { email }
        };
    } catch (error) {
        console.error("Error during sign-in:", error)
        return { success: false, message: 'Sign-in failed. Please try again.' }
    }
}

/**
 * Step 2: Verify OTP and complete sign in
 */
export const verifySignInOTP = async (
    email: string,
    password: string,
    otp: string
) => {
    try {
        await connectToDatabase();

        const verification = await verifyOTP(email, otp, 'signin');

        if (!verification.success) {
            return verification;
        }

        // OTP verified, now complete the sign-in
        const response = await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })

        if (!response) {
            return { success: false, message: 'Sign-in failed after verification.' }
        }

        return {
            success: true,
            message: 'Signed in successfully!',
            data: response
        };
    } catch (error) {
        console.error("Error verifying sign-in OTP:", error);
        return { success: false, message: 'Verification failed. Please try again.' };
    }
}

/**
 * Resend OTP for both signup and signin
 */
export const resendOTPCode = async (
    email: string,
    type: 'signup' | 'signin'
) => {
    try {
        await connectToDatabase();

        const otp = await resendOTP(email, type);
        const emailSent = await sendOTPEmail({ email, otp, type });

        if (!emailSent) {
            return {
                success: false,
                message: 'Failed to resend verification code. Please try again.'
            };
        }

        return {
            success: true,
            message: 'Verification code resent successfully!'
        };
    } catch (error) {
        console.error("Error resending OTP:", error);
        return { success: false, message: 'Failed to resend code. Please try again.' };
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
        return { success: true };
    } catch (error) {
        console.error("Error during sign-out:", error);
        return { success: false, message: 'Sign-out failed. Please try again.' };
    }
}