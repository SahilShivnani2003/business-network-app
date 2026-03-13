export type ValidationRule = (value: string) => string | undefined;

export const required =
    (msg = 'This field is required'): ValidationRule =>
    value =>
        value.trim().length === 0 ? msg : undefined;

export const minLength =
    (min: number, msg?: string): ValidationRule =>
    value =>
        value.trim().length < min
            ? msg || `Must be at least ${min} characters`
            : undefined;

export const isEmail =
    (msg = 'Enter a valid email address'): ValidationRule =>
    value =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : msg;

export const isIndianMobile =
    (msg = 'Enter a valid 10-digit mobile number'): ValidationRule =>
    value =>
        /^[6-9]\d{9}$/.test(value.replace(/\s/g, '')) ? undefined : msg;

export const isOtp =
    (digits = 6, msg?: string): ValidationRule =>
    value =>
        new RegExp(`^\\d{${digits}}$`).test(value.trim())
            ? undefined
            : msg || `Enter the ${digits}-digit OTP`;

export const isStrongPassword =
    (msg?: string): ValidationRule =>
    value => {
        if (value.length < 8) return msg || 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Add at least one uppercase letter';
        if (!/[0-9]/.test(value)) return 'Add at least one number';
        return undefined;
    };

/** Run multiple rules and return the first error found. */
export const validate = (value: string, rules: ValidationRule[]): string | undefined => {
    for (const rule of rules) {
        const err = rule(value);
        if (err) return err;
    }
    return undefined;
};

/** Validate an entire form object. Returns a map of field → error. */
export const validateForm = <T extends Record<string, string>>(
    values: T,
    rules: Partial<Record<keyof T, ValidationRule[]>>,
): Partial<Record<keyof T, string>> => {
    const errors: Partial<Record<keyof T, string>> = {};
    for (const key in rules) {
        const fieldRules = rules[key];
        if (fieldRules) {
            const error = validate(values[key] ?? '', fieldRules);
            if (error) errors[key] = error;
        }
    }
    return errors;
};

/** Returns true when every rule in a rules map passes. */
export const isFormValid = <T extends Record<string, string>>(
    errors: Partial<Record<keyof T, string>>,
): boolean => Object.values(errors).every(e => !e);
