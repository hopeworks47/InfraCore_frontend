"use client";

import type { NewProjectButtonProps } from "@/types/components.types";

export default function NewProjectButton({ label = "New project", onClick, onOpen }: NewProjectButtonProps) {
    const handleClick = () => {
        if (onOpen) {
            onOpen();
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
            {label}
        </button>
    );
}
