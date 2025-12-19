'use server'

import { auth, getAuth } from "../better-auth/auth"

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
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
            }
        })

        if (response) {
            try {
               
            } catch (evErr) {
                console.error('Inngest event send failed:', evErr);
            }
        }

        return { success: true, data: response };
        } catch (error) {
            console.error("Error during sign-up:", error)
            return { success: false, message: 'Sign-up failed. Please try again.' } 
        }

    }
