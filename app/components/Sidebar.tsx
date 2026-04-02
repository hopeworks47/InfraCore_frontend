"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 12a2 2 0 012-2h3v10H6a2 2 0 01-2-2v-6zm11-6h3a2 2 0 012 2v10a2 2 0 01-2 2h-3V6zm-6 8h6v6H9v-6zm0-10h6v8H9V4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Team Members",
    href: "/dashboard/team",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M16 11a3 3 0 100-6 3 3 0 000 6zM8 12a3 3 0 100-6 3 3 0 000 6zm8 2c-2.2 0-6.6 1.1-6.6 3.3V20H22v-2.7C22 15.1 17.8 14 16 14zm-8 0c-1.8 0-6 1.1-6 3.3V20h6v-2.7c0-1 .4-1.9 1.1-2.6A7.8 7.8 0 008 14z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v2H4V6zm0 6h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M19.4 13a7.7 7.7 0 000-2l2-1.6a.6.6 0 00.1-.8l-1.9-3.3a.6.6 0 00-.8-.2l-2.3.9a8 8 0 00-1.7-1l-.3-2.4a.6.6 0 00-.6-.6h-3.8a.6.6 0 00-.6.6l-.3 2.4c-.6.3-1.2.6-1.7 1l-2.3-1a.6.6 0 00-.8.2L2.5 8.6a.6.6 0 00.1.8L4.6 11a7.7 7.7 0 000 2l-2 1.6a.6.6 0 00-.1.8l1.9 3.3a.6.6 0 00.8.2l2.3-.9c.5.4 1.1.8 1.7 1l.3 2.4a.6.6 0 00.6.6h3.8a.6.6 0 00.6-.6l.3-2.4c.6-.3 1.2-.6 1.7-1l2.3.9a.6.6 0 00.8-.2l1.9-3.3a.6.6 0 00-.1-.8L19.4 13zm-7.4 2a3 3 0 110-6 3 3 0 010 6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isCollapsed = mobileOpen;

  return (
    <aside
      className={`flex h-screen w-20 flex-col bg-gray-800 text-white transition-all duration-200 ${
        isCollapsed ? "md:w-20" : "md:w-64"
      }`}
    >
      <div className="flex items-center justify-center border-b border-gray-700 p-4 md:justify-between">
        <Image
          src="/mobile-logo.svg"
          alt="InfraCore"
          width={28}
          height={28}
          priority
          className="w-7 md:hidden"
        />
        <Image
          src="/mobile-logo.svg"
          alt="InfraCore"
          width={28}
          height={28}
          priority
          className={`${isCollapsed ? "hidden md:block md:w-7" : "hidden"}`}
        />
        <Image
          src="/infracore_logo.svg"
          alt="InfraCore"
          width={140}
          height={28}
          priority
          className={`${isCollapsed ? "hidden" : "hidden md:block md:w-[140px]"}`}
        />
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="hidden rounded-md p-2 text-white hover:bg-gray-700 md:inline-flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d={isCollapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.name}
                className={`flex items-center gap-3 rounded-md px-4 py-2 ${
                  isCollapsed ? "justify-center md:justify-center" : "justify-center md:justify-start"
                } ${
                  pathname === item.href
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span className={`${isCollapsed ? "hidden" : "hidden md:inline"}`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>      
    </aside>
  );
}