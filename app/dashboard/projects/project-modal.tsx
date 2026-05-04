"use client";

import type { ProjectModalProps } from "@/types/components.types";

const statusOptions = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "qa", label: "QA" },
    { value: "complete", label: "Complete" },
    { value: "done", label: "Done" },
];

export default function ProjectModal({ isOpen, project, onClose, onStatusChange }: ProjectModalProps) {
    if (!isOpen || !project) {
        return null;
    }

    const normalizedStatusValue = project.status
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_")
        .replace("inprogress", "in_progress");

    const attachmentImages = (() => {
        if (!project.attachments) {
            return [];
        }

        if (Array.isArray(project.attachments)) {
            return project.attachments
                .map((value) => String(value).trim())
                .filter(Boolean);
        }

        if (typeof project.attachments === "string") {
            return project.attachments
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean);
        }

        return [];
    })();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
            <div
                className="relative w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-hidden bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                    ✕
                </button>
                <div className="flex h-full min-h-0">
                    {/* Left Panel */}
                    <div className="min-h-0 flex-1 overflow-y-auto border-r border-slate-200 p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
                            <p className="text-sm text-slate-500 mt-1">{project.task_type}</p>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-900 mb-3">Attachments</label>
                            {attachmentImages.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {attachmentImages.map((url, index) => (
                                        <div key={`${url}-${index}`} className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`}
                                                alt={`Attachment ${index + 1}`}
                                                className="h-24 w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No attachments</p>
                            )}
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-900 mb-3">Description</label>
                            <p className="text-sm text-slate-600 leading-6">
                                {project.description || "Add a description..."}
                            </p>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-900 mb-3">Priority</label>
                            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-sm font-medium text-slate-700">
                                {project.priority}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <div className="flex gap-4 mb-6">
                                <button className="text-sm font-semibold text-slate-900 border-b-2 border-blue-600 pb-3">Comments</button>
                                <button className="text-sm font-medium text-slate-500 pb-3">History</button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0"></div>
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="flex-1 text-sm text-slate-600 border-0 outline-none"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 ml-11">Pro tip: press M to comment</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="min-h-0 w-80 overflow-y-auto border-l border-slate-200 bg-slate-50 p-6">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pinned fields</p>
                            </div>
                            <p className="text-xs text-slate-500">Click on the ⭐ next to a field label to start pinning.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Details</h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Status</label>
                                        <select
                                            value={normalizedStatusValue}
                                            onChange={(event) => onStatusChange?.(event.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Assignee</label>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-600">{project.assignee_id || "Unassigned"}</p>
                                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Assign to me</button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Labels</label>
                                        <p className="text-sm text-slate-600">None</p>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Reporter</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-400"></div>
                                            <p className="text-sm text-slate-600">Me</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Due date</label>
                                        <p className="text-sm text-slate-600">{project.due_date || "No due date"}</p>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4">
                                        <p className="text-xs text-slate-500">
                                            <span className="font-medium text-slate-600">Created</span> 4 minutes ago
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            <span className="font-medium text-slate-600">Updated</span> 4 minutes ago
                                        </p>
                                    </div>

                                    <button className="w-full text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md py-2 hover:bg-slate-100 transition">
                                        ⚙️ Configure
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
