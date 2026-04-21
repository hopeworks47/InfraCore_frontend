"use client";

import { useState, useRef } from "react";
import type { NewProjectModalProps } from "@/types/components.types";

export default function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        title: "",
        type: "Task",
        assignee: "Unassigned",
        due: "",
        status: "Todo",
        description: ""
    });
    const [attachments, setAttachments] = useState<string[]>([]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAttach = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result;
                    if (result) {
                        setAttachments((prev) => [...prev, result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!formData.title.trim()) {
            alert("Project title is required");
            return;
        }
        onSubmit(formData);
        setFormData({
            title: "",
            type: "Task",
            assignee: "Unassigned",
            due: "",
            status: "Todo",
            description: ""
        });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-5xl overflow-hidden bg-white shadow-2xl relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                    ✕
                </button>
                <div className="flex h-[600px]">
                    {/* Left Panel */}
                    <div className="flex-1 border-r border-slate-200 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">Create Project</h1>
                            <p className="text-sm text-slate-500 mt-1">Add a new project to your board</p>
                        </div>

                        <div className="mb-6 flex gap-2">
                            <button 
                                type="button"
                                onClick={handleAttach}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition">
                                📎 Attach
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition">
                                🔗 Link issue
                            </button>
                        </div>

                        {attachments.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-900 mb-3">Attachments</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {attachments.map((image, index) => (
                                        <div key={index} className="relative group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={image} 
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-md border border-slate-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-3">Project Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    placeholder="Enter project title"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-3">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Add a description..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-3">Priority</label>
                                <select
                                    value="Medium"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Urgent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="w-80 bg-slate-50 border-l border-slate-200 p-6 overflow-y-auto flex flex-col">
                        <div className="space-y-6 flex-1">
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Details</h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => handleChange("type", e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option>Task</option>
                                            <option>Story</option>
                                            <option>Epic</option>
                                            <option>Bug</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Assignee</label>
                                        <select
                                            value={formData.assignee}
                                            onChange={(e) => handleChange("assignee", e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option>Unassigned</option>
                                            <option>Ava</option>
                                            <option>Noah</option>
                                            <option>Mia</option>
                                            <option>Ethan</option>
                                            <option>Liam</option>
                                            <option>Olivia</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Due Date</label>
                                        <input
                                            type="date"
                                            value={formData.due}
                                            onChange={(e) => handleChange("due", e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option>Todo</option>
                                            <option>In Progress</option>
                                            <option>QA</option>
                                            <option>Complete</option>
                                            <option>Done</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4 space-y-3">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                            >
                                Create Project
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-2 rounded-md transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
