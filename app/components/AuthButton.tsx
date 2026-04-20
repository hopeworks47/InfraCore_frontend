// components/AuthButton.tsx
"use client"

import Link from "next/link"

export default function AuthButton({
  isAuthenticated,
  size = "md",
}: {
  isAuthenticated: boolean
  size?: "sm" | "md" | "lg"
}) {
  const base = "rounded-md font-semibold text-white transition"

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3 text-base",
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className={`${base} ${sizes[size]} bg-green-600 hover:bg-green-700`}
      >
        Go to Dashboard
      </Link>
    )
  }

  return (
    <Link
      href="/login"
      className={`${base} ${sizes[size]} bg-blue-600 hover:bg-blue-500`}
    >
      Login
    </Link>
  )
}