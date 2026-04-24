import { useState, ChangeEvent, FormEvent } from 'react';
import type { FormFields, UseFormOptions, UseFormReturn } from '../types/forms.types';

export function useForm<T extends FormFields>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
  };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      // Support multiple files: store array
      if (e.target.multiple) {
        setValues(prev => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setValues(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setValues(prev => ({ ...prev, [name]: [] })); // or null for single
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleFileChange,
    setValues,
  };
}