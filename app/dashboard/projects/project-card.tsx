"use client";

import type { DragEvent } from "react";

type ProjectCardProps = {
    title: string;
    type: string;
    assignee: string;
    due: string;
    onClick?: () => void;
    onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
    onDragEnd?: () => void;
};

export default function ProjectCard({ title, type, assignee, due, onClick, onDragStart, onDragEnd }: ProjectCardProps) {
    return (
        <div
            draggable
            onClick={onClick}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold uppercase text-blue-700">
                    {type}
                </span>
            </div>
            <h4 className="text-base font-semibold">{title}</h4>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span>{assignee}</span>
                <span>{due}</span>
            </div>
        </div>
    );
}
