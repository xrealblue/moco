'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { verifySignUpOTP, verifySignInOTP, resendOTPCode } from '@/lib/actions/auth.actions'
import { useRouter } from 'next/navigation'
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
                result = await verifySignUpOTP(email, otpCode, userData)
            } else if (type === 'signin' && password) {
                result = await verifySignInOTP(email, password, otpCode)
            } else {
                toast.error('Invalid verification request')
                setLoading(false)
                return
            }

            if (result.success) {
                toast.success(result.message)
                if (type === 'signup') {
                    router.push('/sign-in?verified=true')
                } else {
                    router.push('/')
                    router.refresh()
                }
            } else {
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
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-white text-2xl font-bold">Verify Your Email</h2>
                <p className="text-gray-400 text-sm">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-medium text-white">{email}</span>
                </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center gap-2">
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
                        className="w-12 h-14 text-center text-2xl font-bold bg-transparent border-2 border-gray-600 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white"
                        disabled={loading}
                    />
                ))}
            </div>

            {/* Verify Button */}
            <Button
                onClick={handleVerify}
                disabled={loading || otp.join('').length !== 6}
                className="yellow-btn w-full"
            >
                {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
                <p className="text-sm text-gray-400">
                    Didn't receive the code?{' '}
                    <button
                        onClick={handleResend}
                        disabled={resendLoading || resendCooldown > 0}
                        className="text-yellow-500 font-medium hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : resendLoading
                                ? 'Sending...'
                                : 'Resend Code'}
                    </button>
                </p>
            </div>

            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="w-full py-2 text-gray-400 hover:text-white font-medium transition-colors"
                >
                    ← Back to {type === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>
            )}
        </div>
    )
}