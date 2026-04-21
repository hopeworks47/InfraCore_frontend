"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { useForm } from "@/hooks/useForm";

/**
 * Profile Page Component
 *
 * Displays and allows editing of the current user's profile information
 * including name, email, profile image, and account details.
 */
export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const validationErrors: Partial<Record<keyof typeof values, string>> = {};
      if (!values.currentPassword) validationErrors.currentPassword = "Current password is required.";
      if (!values.newPassword) validationErrors.newPassword = "New password is required.";
      else if (values.newPassword.length < 6) validationErrors.newPassword = "New password must be at least 6 characters.";
      if (!values.confirmPassword) validationErrors.confirmPassword = "Confirm password is required.";
      if (values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match.";
      }
      return validationErrors;
    },
    onSubmit: async (formValues) => {
      setPasswordError("");
      setPasswordSuccess("");

      if (!apiBaseUrl) {
        setPasswordError("API base URL is not configured.");
        return;
      }

      try {
        const session = await getSession();
        const token = session?.user?.accessToken;
        if (!token) {
          setPasswordError("Unable to authenticate request.");
          return;
        }

        const response = await fetch(`${apiBaseUrl}/api/v1/users/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: formValues.currentPassword,
            new_password: formValues.newPassword,
            confirm_password: formValues.confirmPassword,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          setPasswordError(data.detail || data.message || "Password change failed.");
          return;
        }

        setPasswordSuccess(data.message || "Password updated successfully.");
        setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } catch (error) {
        setPasswordError(error instanceof Error ? error.message : "Password change failed.");
      }
    },
  });

  useEffect(() => {
    // Fetch current user data when component mounts
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load profile information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center space-x-6">
            {/* Profile Image */}
            <div className="relative">
              {user.profile_image ? (
                <Image
                  src={`${apiBaseUrl}${user.profile_image}`}
                  alt={user.name || "Profile"}
                  width={80}
                  height={80}
                  className="rounded-full object-cover ring-4 ring-white"
                  unoptimized
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-4 ring-white">
                  <span className="text-2xl font-bold text-blue-600">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-white">
              <h2 className="text-2xl font-bold">{user.name || "No Name"}</h2>
              <p className="text-blue-100">{user.email || "No Email"}</p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                  {user.role || "Member"}
                </span>
                <span className="text-sm text-blue-100">
                  Member
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={user.name || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{user.name || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue={user.email || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{user.email || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-gray-900 capitalize">{user.role || "Member"}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Status</label>
                  <p className="mt-1 text-green-600 font-medium">Active</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-gray-900">Recently</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-gray-900">Never</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Sections (Future Enhancement) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                setShowPasswordForm((prev) => {
                  if (prev) {
                    setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }
                  return !prev;
                });
                setPasswordError("");
                setPasswordSuccess("");
              }}
              className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {showPasswordForm ? "Hide Password Form" : "Change Password"}
            </button>
            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Two-Factor Authentication
            </button>
          </div>
          {showPasswordForm && (
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h4 className="text-base font-semibold text-slate-900 mb-4">Update your password</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.currentPassword && <p className="text-sm text-red-600">{errors.currentPassword}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isSubmitting ? "Saving..." : "Save New Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Notification Settings
            </button>
            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Theme Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}