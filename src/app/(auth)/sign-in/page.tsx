'use client'

import FooterLink from "@/components/form/FooterLink"
import InputField from "@/components/form/InputField"
import OTPVerification from "@/components/OTPVerification"
import { Button } from "@/components/ui/button"
import { signInWithEmail } from "@/lib/actions/auth.actions"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type SignINFormData = {
  email: string
  password: string
}

const SignInPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [credentials, setCredentials] = useState<SignINFormData | null>(null);

  const { register, handleSubmit, formState: {
    errors, isSubmitting,
  } } = useForm<SignINFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = async (data: SignINFormData) => {
    try {
      const result = await signInWithEmail(data);

      if (result.success && result.requiresOTP) {
        setCredentials(data);
        setStep('otp');
        toast.success('Verification code sent to your email!');
        return;
      }

      if (result.success) {
        toast.success('Signed in! Redirecting...')
        router.push('/')
        router.refresh()
        return;
      }

      toast.error(result.message || 'Sign in failed. Please try again.');
    } catch (e) {
      console.log(e)
      toast.error('Sign In Failed. please try again.')
    }
  }

  // Show OTP verification step
  if (step === 'otp' && credentials) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
        <OTPVerification
          email={credentials.email}
          password={credentials.password}
          type="signin"
          onBack={() => setStep('form')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/50 hover:border-zinc-700/50 transition-all duration-300">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-2">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                Sign in to your account to continue your journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5 text-white">
                <InputField
                  name="email"

                  label="Email"
                  placeholder="name@example.com"
                  register={register}
                  error={errors.email}
                  validation={{
                    required: "Email is required.",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address"
                    }
                  }}
                />

                <div className="space-y-2">
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{
                      required: "Password is required.",
                    }}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs cursor-pointer sm:text-sm text-zinc-500 hover:text-blue-400 transition-colors duration-200 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
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
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    Sign In
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-3 text-zinc-500 font-medium">
                    New to our platform?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-zinc-400 text-sm sm:text-base">
                  Don't have an account?{' '}
                  <a
                    href="/sign-up"
                    className="text-white font-semibold hover:text-blue-400 transition-colors duration-200 underline-offset-4 hover:underline inline-flex items-center gap-1"
                  >
                    Sign Up
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SignInPage