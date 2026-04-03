"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/slices/authSlice";
import { useForm } from "@/hooks/useForm";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
        router.push('/dashboard')
    }
  }, [user, router])
  
  const { values, errors, handleChange, handleFileChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      email: '',
      password: '',
      name: '',
      role: 'member', // default
      profileImage: null,
      birthdate: '',
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (!values.name) errors.name = 'Name is required';
      if (values.birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(values.birthdate)) {
        errors.birthdate = 'Invalid date format (YYYY-MM-DD)';
      }
      return errors;
    },
    onSubmit: async (formValues) => {        
        const formData = new FormData();
        formData.append('email', formValues.email);
        formData.append('password', formValues.password);
        formData.append('name', formValues.name);
        formData.append('role', formValues.role);
        if (formValues.birthdate) formData.append('birthdate', formValues.birthdate);
        if (formValues.profileImage && (formValues.profileImage as any) instanceof File) {
            formData.append('profile_image', formValues.profileImage);
        }
        await dispatch(registerUser(formData));
      // On success, Redux state will have user and redirect via useEffect
    },
  });

  const handleInputFocus = () => {
    if (error) dispatch(clearError());
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">        
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            onFocus={handleInputFocus}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onFocus={handleInputFocus}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password *</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onFocus={handleInputFocus}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="admin">Admin</option>
            <option value="leader">Leader</option>
            <option value="member">Member</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}            
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Birthdate (YYYY-MM-DD)</label>
          <input
            type="text"
            name="birthdate"
            value={values.birthdate}
            onChange={handleChange}
            placeholder="1990-01-01"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
            {isSubmitting || isLoading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}