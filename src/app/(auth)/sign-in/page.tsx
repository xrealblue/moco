'use client'

import FooterLink from "@/components/form/FooterLink"
import InputField from "@/components/form/InputField"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/better-auth/client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type SignINFormData = {
  email: string
  password: string
}

const SignInPage = () => {
  const router = useRouter();
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
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
            onSuccess: () => {
                toast.success('signed in! Redirecting...')
                router.push('/')
                router.refresh() // Ensure server components re-fetch session
            },
            onError: (ctx) => {
                toast.error(ctx.error.message || 'Sign in Failed. Please Try Again.!')
            }
        }
      });
    } catch (e) {
      console.log(e)
      toast.error('Sign In Failed. please try again.')
    }
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