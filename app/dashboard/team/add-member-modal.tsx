"use client";

import { useForm } from "@/hooks/useForm";
import { useAppDispatch } from "@/store/hooks";
import { addUser } from "@/store/slices/userSlice";

interface AddMemberModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onAddSuccess: () => void;
}

type AddMemberFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "leader" | "member";
  profile_image: File | null;
};

export default function AddMemberModal({
  isOpen,
  onCancel,
  onAddSuccess,
}: AddMemberModalProps) {
  const dispatch = useAppDispatch();
  const { values, errors, handleChange, handleFileChange, handleSubmit } = useForm<AddMemberFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "member",
      profile_image: null,
    },
    validate: (values) => {
      const validationErrors: Partial<Record<keyof AddMemberFormValues, string>> = {};
      if (!values.name.trim()) validationErrors.name = "Name is required";
      if (!values.email.trim()) validationErrors.email = "Email is required";
      if (!values.password) validationErrors.password = "Password is required";
      if (values.password.length < 6) validationErrors.password = "Password must be at least 6 characters";
      if (!values.confirmPassword) validationErrors.confirmPassword = "Confirm password is required";
      if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }
      return validationErrors;
    },
    onSubmit: async (formValues: AddMemberFormValues) => {
      const formData = new FormData();
      formData.append('name', formValues.name.trim());
      formData.append('email', formValues.email.trim());
      formData.append('password', formValues.password);
      formData.append('role', formValues.role);
      if (formValues.profile_image instanceof File) {
        formData.append('profile_image', formValues.profile_image);
      }

      try {
        const result = await dispatch(addUser(formData));
        if (addUser.fulfilled.match(result)) {
          onAddSuccess();
        }
      } catch (error) {
        console.error("Failed to add user:", error);
      }
    },
  });

  const isSubmitDisabled = !values.name.trim() || !values.email.trim() || !values.password || !values.confirmPassword;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Add Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={values.role}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="admin">admin</option>
              <option value="leader">leader</option>
              <option value="member">member</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
