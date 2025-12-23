import FooterLink from "@/components/form/FooterLink";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
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
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ISignUpFormData>({
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

            if (result.success) {
                toast.success('Account created! Redirecting...');
                setTimeout(() => router.push('/'), 800);
                return;
            }

            toast.error(result.message || 'Sign up failed. Please try again.');
        } catch (error) {
            console.error('Error submitting form:', error);
            const msg = error instanceof Error ? error.message : 'Failed to create an account.';
            toast.error('Sign up failed. Please try again.');
            console.error(msg);
        }
    }


    return (
        <>

            <div className="">
                <div className="">
                    <div className="text-white text-2xl font-bold">Sign Up</div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputField
                            name="fullName"
                            label="Full Name"
                            placeholder="Enter your full name"
                            register={register}
                            error={errors.fullName}
                            validation={{ required: "Full name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } }}
                        />

                        <InputField
                            name="email"
                            label="Email"
                            placeholder="Enter your email address"
                            register={register}
                            error={errors.email}
                            validation={{ required: "Email address is required", pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email address" } }}
                        />

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

                        <CountrySelectField
                            name="country"
                            label="Country"
                            control={control}
                            error={errors.country}
                            required
                        />

                        <SelectField
                            name="investmentGoals"
                            label="Investment Goals"
                            placeholder="Select your investment objectives"
                            options={INVESTMENT_GOALS}
                            control={control}
                            error={errors.investmentGoals}
                            required
                        />


                        <SelectField
                            name="riskTolerance"
                            label="Risk Tolerance"
                            placeholder="Select your risk tolerance level"
                            options={RISK_TOLERANCE_OPTIONS}
                            control={control}
                            error={errors.riskTolerance}
                            required
                        />

                        <SelectField
                            name="preferredIndustry"
                            label="Preferred Industry"
                            placeholder="Select your preferred industry sector"
                            options={PREFERRED_INDUSTRIES}
                            control={control}
                            error={errors.preferredIndustry}
                            required
                        />

                        <Button type="submit" className="yellow-btn w-full mt-5" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account" : "Welcome to FinSight!"}
                        </Button>

                        <FooterLink text="Already have an account?" linkText="Sign In" href="/sign-in" />
                    </form>
                </div>
            </div>
        </>
    )
}