"use client";

import { useEffect } from "react";
import { useForm } from "@/hooks/useForm";
import { useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/userSlice";
import type { TeamMember } from "@/types/user.types";

interface EditMemberModalProps {
  isOpen: boolean;
  member: TeamMember | null;
  onCancel: () => void;
  onUpdateSuccess: (updatedMember: TeamMember) => void;
}

type MemberFormValues = {
  name: string;
  email: string;
  role: "admin" | "leader" | "member";
  profile_image: File | string | null;
};

export default function EditMemberModal({
  isOpen,
  member,
  onCancel,
  onUpdateSuccess,
}: EditMemberModalProps) {
  const dispatch = useAppDispatch();
  const { values, errors, handleChange, handleFileChange, handleSubmit, setValues } = useForm<MemberFormValues>({
    initialValues: {
      name: "",
      email: "",
      role: "member",
      profile_image: null,
    },
    validate: (values) => {
      const validationErrors: Partial<Record<keyof MemberFormValues, string>> = {};
      if (!values.name.trim()) validationErrors.name = "Name is required";
      if (!values.email.trim()) validationErrors.email = "Email is required";
      return validationErrors;
    },
    onSubmit: async (formValues: MemberFormValues) => {
      if (!member) {
        return;
      }
      const formData = new FormData();
      formData.append('name', formValues.name.trim());
      formData.append('email', formValues.email.trim());
      formData.append('role', formValues.role);
      if (formValues.profile_image instanceof File) {
        formData.append('profile_image', formValues.profile_image);
      }
      try {
        const result = await dispatch(updateUser({ userId: member._id, updateData: formData }));
        if (updateUser.fulfilled.match(result)) {
          // Merge API response with existing member data to ensure all TeamMember fields are present
          const updatedMember: TeamMember = {
            ...member,
            ...result.payload,
            _id: member._id, // Ensure _id stays the same
          };
          onUpdateSuccess(updatedMember);
        } else {
          console.log("Update failed:", result);
        }
      } catch (error) {
        console.error("Failed to update user:", error);
        // Optionally show error
      }
    },
  });

  // Update form values when member changes
  useEffect(() => {
    if (member && isOpen) {
      setValues({
        name: member.name || "",
        email: member.email || "",
        role: member.role || "member",
        profile_image: member.profile_image || null,
      });
    }
  }, [member, isOpen, setValues]);

  const isUpdateDisabled = !values.name.trim() || !values.email.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Update Member</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
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
              disabled={isUpdateDisabled}
              className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"              
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
