'use client'

import FooterLink from "@/components/form/FooterLink"
import InputField from "@/components/form/InputField"
import OTPVerification from "@/components/OTPVerification"
import { Button } from "@/components/ui/button"
import { signInWithEmail } from "@/lib/actions/auth.actions"
import { useRouter } from "next/navigation"
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
      <div className="">
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
    <>
      <div className="">
        <div className="">
          <div className="text-white text-2xl font-bold">Welcome Back!</div>

          <form onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <InputField
              name="email"
              label="Email"
              placeholder="Enter your email"
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

            <InputField
              name="password"
              label="Password"
              placeholder="Enter your password"
              register={register}
              error={errors.password}
              validation={{
                required: "Password is required.",
              }}
            />

            <Button
              type="submit"
              className="w-full mt-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <FooterLink
              text="Don't have an account? Sign Up"
              linkText="Sign Up"
              href='/sign-up'
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default SignInPage