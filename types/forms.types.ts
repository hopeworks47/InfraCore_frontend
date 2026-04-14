// Form related types
export interface FormFields {
    [key: string]: any;
}

export interface UseFormOptions<T extends FormFields> {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
    onSubmit: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T extends FormFields> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    isSubmitting: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resetForm: () => void;
    setFieldValue: (field: keyof T, value: any) => void;
}
