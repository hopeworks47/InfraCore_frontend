"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";

export default function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      dispatch(fetchCurrentUser());
    } else {
      signOut({ callbackUrl: "/login" });
    }
  }, [status, session, dispatch]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-blue-950 px-6 py-[13px]">
      <div className="w-full max-w-md">
        <label htmlFor="dashboard-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200/80"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M11 4a7 7 0 015.5 11.3l3.1 3.2a1 1 0 01-1.4 1.4l-3.2-3.1A7 7 0 1111 4zm0 2a5 5 0 100 10 5 5 0 000-10z"
              fill="currentColor"
            />
          </svg>
          <input
            id="dashboard-search"
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-blue-400"
          />
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="flex items-center gap-3 rounded-md px-2 py-1 text-blue-50 transition-colors hover:bg-blue-900/80"
          aria-label="Open profile menu"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <span className="hidden text-right md:block">
            <span className="block text-sm font-semibold text-blue-50">
              {user && user.name ? user.name : "User"}
            </span>
            <span className="block text-xs text-blue-200/80">
              {user && user.email ? user.email : "No Email"}
            </span>
          </span>
          {user && user.profileImage ? (
            <Image
              src={`${apiBaseUrl}${user.profileImage}`}
              alt={user && user.name ? user.name : "User Avatar"}
              width={36}
              height={36}
              className="rounded-full object-cover ring-1 ring-gray-300"
              unoptimized
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-700 ring-1 ring-gray-300">
              User
            </span>
          )}
        </button>

        {isOpen ? (
          <div
            className="absolute right-0 z-50 mt-2 w-44 rounded-md border border-blue-800 bg-blue-950 py-1 shadow-xl shadow-black/30"
            role="menu"
          >
            <Link
              href="/dashboard/profile"
              className="block px-4 py-2 text-sm text-blue-100 hover:bg-blue-900/80"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-sm text-blue-100 hover:bg-blue-900/80"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
