"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/authSlice";
import { useForm } from "@/hooks/useForm";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if(user) {
        router.push('/dashboard');
    }
  }, [user, router])

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {email: '', password: ''},
    validate: (values) => {
        const errors: any = {};
        if (!values.email) errors.email = "Email is Required!";
        if (!values.password) errors.password = "Password is Required!";
        return errors;
    },
    onSubmit: async (formValues) => {
        const result = await dispatch(loginUser(formValues));
        if(loginUser.fulfilled.match(result)) {
            router.push('/dashboard');
        }
    }
  })

  const handleInputFocus = () => {
    if (error) dispatch(clearError());
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
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
          <label className="block text-sm font-medium text-gray-700">Password</label>
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
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {isSubmitting || isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      {/* <p className="mt-4 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p> */}
    </>
  );
}