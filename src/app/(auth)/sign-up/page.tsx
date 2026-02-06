'use client'

import { CountrySelectField } from "@/components/form/CountrySelectField";
import FooterLink from "@/components/form/FooterLink";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import OTPVerification from "@/components/OTPVerification";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ISignUpFormData = {
    email: string;
    password: string;
    country: string;
    fullName: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
}

const SignUpPage = () => {
    const router = useRouter();
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [formData, setFormData] = useState<ISignUpFormData | null>(null);

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ISignUpFormData>({
        defaultValues: {
            email: '',
            password: '',
            country: '',
            fullName: '',
            investmentGoals: '',
            riskTolerance: '',
            preferredIndustry: '',
        }
    });

    const onSubmit = async (data: ISignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);

            if (result.success && result.requiresOTP) {
                setFormData(data);
                setStep('otp');
                toast.success('Verification code sent to your email!');
                return;
            }

            if (result.success) {
                toast.success('Account created! Redirecting...');
                setTimeout(() => router.push('/'), 1500);
                return;
            }

            toast.error(result.message || 'Sign up failed. Please try again.');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Sign up failed. Please try again.');
        }
    }

    // Show OTP verification step
    if (step === 'otp' && formData) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
                <OTPVerification
                    email={formData.email}
                    type="signup"
                    userData={{
                        fullName: formData.fullName,
                        country: formData.country,
                        investmentGoals: formData.investmentGoals,
                        riskTolerance: formData.riskTolerance,
                        preferredIndustry: formData.preferredIndustry,
                    }}
                    password={formData.password}
                    onBack={() => setStep('form')}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 relative overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-3xl relative z-10">
                <div className="bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl shadow-black/50 hover:border-zinc-700/50 transition-all duration-300">
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-3 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 mb-2">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent play">
                                Create New Account
                            </h1>
                            <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
                                Join Moco and start your trading journey with confidence
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                                    <InputField
                                        name="fullName"
                                        label="Full Name"
                                        placeholder="John Doe"
                                        register={register}
                                        error={errors.fullName}
                                        validation={{
                                            required: "Full name is required",
                                            minLength: { value: 2, message: "Name must be at least 2 characters" }
                                        }}
                                    />

                                    <InputField
                                        name="email"
                                        label="Email Address"
                                        placeholder="name@example.com"
                                        register={register}
                                        error={errors.email}
                                        validation={{
                                            required: "Email address is required",
                                            pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email address" }
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                                    <InputField
                                        name="password"
                                        label="Password"
                                        placeholder="Create a secure password"
                                        type="password"
                                        register={register}
                                        error={errors.password}
                                        validation={{
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters"
                                            }
                                        }}
                                    />
                                    <div className="text-black">
                                        <CountrySelectField
                                            name="country"
                                            label="Country"
                                            control={control}
                                            error={errors.country}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Investment Preferences Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <h2 className="text-lg font-semibold text-white">Investment Preferences</h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                                    <SelectField
                                        name="preferredIndustry"
                                        label="Preferred Industry"
                                        placeholder="Select industry"
                                        options={PREFERRED_INDUSTRIES}
                                        control={control}
                                        error={errors.preferredIndustry}
                                        required
                                    />

                                    <SelectField
                                        name="investmentGoals"
                                        label="Investment Goals"
                                        placeholder="Select your goal"
                                        options={INVESTMENT_GOALS}
                                        control={control}
                                        error={errors.investmentGoals}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                                    <SelectField
                                        name="riskTolerance"
                                        label="Risk Tolerance"
                                        placeholder="Select risk level"
                                        options={RISK_TOLERANCE_OPTIONS}
                                        control={control}
                                        error={errors.riskTolerance}
                                        required
                                    />

                                    {/* Empty div for grid alignment */}
                                    <div className="hidden lg:block" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-500 cursor-pointer  text-white font-semibold rounded-xl transition-all duration-300 text-base shadow-lg hover:border-white border-2 border-blue-500  active:scale-[0.98]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating your account...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 justify-center">
                                        Create Account
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                )}
                            </Button>



                            {/* Sign In Link */}
                            <div className="text-center">
                                <p className="text-zinc-400 text-sm sm:text-base play">
                                    Already have an account?{' '}
                                    <a
                                        href="/sign-in"
                                        className="text-white font-semibold hover:text-emerald-400 transition-colors duration-200 underline-offset-4 hover:underline inline-flex items-center gap-1"
                                    >
                                        Sign In
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-zinc-500">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;