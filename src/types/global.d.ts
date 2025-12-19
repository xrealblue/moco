// here is all global types

declare global {
    interface SignInFormData {
        email: string;
        password: string;
    };

    type SignUpFormData = {
        fullname: string;
        email: string;
        password: string;
        country: string;
        investmentGoals: string;
        riskTolerance: string;
        preferredIndustry: string;
    };

    type CountrySelectProps = {
        name: string;
        label: string;
        control: Control;
        error?: FieldError;
        required?: boolean;
    }
}