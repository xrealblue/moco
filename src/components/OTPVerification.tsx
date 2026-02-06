'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { verifySignUpOTP, verifySignInOTP, resendOTPCode } from '@/lib/actions/auth.actions'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface OTPVerificationProps {
    email: string
    type: 'signup' | 'signin'
    password?: string // Only needed for signin
    userData?: {
        fullName: string
        country: string
        investmentGoals: string
        riskTolerance: string
        preferredIndustry: string
    } // Only needed for signup
    onBack?: () => void
}

export default function OTPVerification({
    email,
    type,
    password,
    userData,
    onBack
}: OTPVerificationProps) {
    const router = useRouter()
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pastedData = value.slice(0, 6).split('')
            const newOtp = [...otp]
            pastedData.forEach((char, i) => {
                if (index + i < 6 && /^\d$/.test(char)) {
                    newOtp[index + i] = char
                }
            })
            setOtp(newOtp)

            // Focus last filled input or last input
            const lastFilledIndex = Math.min(index + pastedData.length, 5)
            inputRefs.current[lastFilledIndex]?.focus()
            return
        }

        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        if (/^\d+$/.test(pastedData)) {
            const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
            setOtp(newOtp.slice(0, 6))
            inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
        }
    }

    const handleVerify = async () => {
        const otpCode = otp.join('')

        if (otpCode.length !== 6) {
            toast.error('Please enter the complete 6-digit code')
            return
        }

        setLoading(true)

        try {
            let result

            if (type === 'signup' && userData) {
                result = await verifySignUpOTP(email, otpCode, userData, password)
            } else if (type === 'signin' && password) {
                result = await verifySignInOTP(email, password, otpCode)
            } else {
                toast.error('Invalid verification request')
                setLoading(false)
                return
            }

            if (result.success) {
                console.log('Verification successful', result);
                toast.success(result.message)
                console.log('Redirecting to /');
                router.push('/')
                router.refresh()
            } else {
                console.log('Verification failed', result);
                toast.error(result.message || 'Verification failed')
            }
        } catch (err) {
            toast.error('An error occurred. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (resendCooldown > 0) return

        setResendLoading(true)

        try {
            const result = await resendOTPCode(email, type)

            if (result.success) {
                toast.success('Verification code resent!')
                // Set cooldown for 60 seconds
                setResendCooldown(60)
                const interval = setInterval(() => {
                    setResendCooldown(prev => {
                        if (prev <= 1) {
                            clearInterval(interval)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
            } else {
                toast.error(result.message || 'Failed to resend code')
            }
        } catch (err) {
            toast.error('Failed to resend code. Please try again.')
            console.error(err)
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-3">
                <h2 className="text-white text-3xl font-bold tracking-tight">Verify Email</h2>
                <div className="text-gray-400 text-sm">
                    Enter the code sent to
                    <div className="font-medium text-white mt-1">{email}</div>
                </div>
            </div>

            {/* OTP Input */}
            <div>
                <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputRefs.current[index] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={e => handleChange(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={`
                                w-10 h-12 sm:w-12 sm:h-14 
                                text-center text-xl sm:text-2xl font-semibold 
                                bg-zinc-900 border border-zinc-700 rounded-md 
                                focus:border-white focus:ring-1 focus:ring-white 
                                outline-none transition-all duration-200 
                                text-white placeholder-zinc-600
                                hover:border-zinc-500
                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            disabled={loading}
                        />
                    ))}
                </div>
                <div className="h-4"></div> {/* Spacer */}
            </div>

            <div className="space-y-4">
                {/* Verify Button */}
                <Button
                    onClick={handleVerify}
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-semibold rounded-md transition-colors text-base"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Verifying...
                        </span>
                    ) : 'Verify Code'}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                    <button
                        onClick={handleResend}
                        disabled={resendLoading || resendCooldown > 0}
                        className="text-sm text-zinc-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-zinc-500"
                    >
                        {resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : resendLoading
                                ? 'Sending...'
                                : 'Resend Code'}
                    </button>
                </div>
            </div>

            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="w-full text-zinc-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to {type === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>
            )}
        </div>
    )
}