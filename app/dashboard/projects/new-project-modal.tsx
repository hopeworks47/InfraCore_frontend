"use client";

import { useRef, useEffect, useMemo } from "react";
import type { NewProjectModalProps } from "@/types/components.types";
import { useForm } from "@/hooks/useForm";
import { useAppDispatch } from '@/store/hooks';
import { createProject } from "@/store/slices/projectSlice";

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleFileChange,
        handleSubmit,
        setValues,
    } = useForm({
        initialValues: {
            title: '',
            description: '',
            priority: 'medium',
            task_type: 'task',
            assignee_id: '',
            due_date: '',
            attachments: [] as File[],
            status: 'todo',
        },
        validate: (values) => {
            const errors: any = {};
            if (!values.title) errors.title = 'Title is required';
            return errors;
        },
        onSubmit: async (formValues) => {
            const formData = new FormData();
            formData.append('title', formValues.title);
            if (formValues.description) formData.append('description', formValues.description);
            formData.append('priority', formValues.priority);
            formData.append('task_type', formValues.task_type);
            if (formValues.assignee_id) formData.append('assignee_id', formValues.assignee_id);
            if (formValues.due_date) formData.append('due_date', formValues.due_date);
            formData.append('status', formValues.status);
            formValues.attachments.forEach(file => {
                formData.append('attachments', file);
            });            
            const result = await dispatch(createProject(formData));
            if (createProject.fulfilled.match(result)) {
                onClose();
            }
        },
    });

    // Derive object URLs from attachments (memoized)
    const objectUrls = useMemo(() => {
        return values.attachments.map(file => URL.createObjectURL(file));
    }, [values.attachments]);

    // Cleanup object URLs when component unmounts or attachments change
    useEffect(() => {
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [objectUrls]);

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const removeAttachment = (index: number) => {
        const newAttachments = [...values.attachments];
        newAttachments.splice(index, 1);
        setValues({ ...values, attachments: newAttachments });
    };

    if (!isOpen) return null;

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
                    <form onSubmit={handleSubmit} className="flex w-full">
                        {/* Left Panel */}
                        <div className="flex-1 border-r border-slate-200 p-6 overflow-y-auto">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-slate-900">Create Project</h1>
                                <p className="text-sm text-slate-500 mt-1">Add a new project to your board</p>
                            </div>

                            <div className="mb-6 flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAttachClick}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition"
                                >
                                    📎 Attach ({values.attachments.length})
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="attachments"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition"
                                >
                                    🔗 Link issue
                                </button>
                            </div>

                            {objectUrls.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-900 mb-3">Attachments</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {objectUrls.map((url, index) => (
                                            <div key={index} className="relative group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={url}
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
                                        name="title"
                                        value={values.title}
                                        onChange={handleChange}
                                        placeholder="Enter project title"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-3">Description</label>
                                    <textarea
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        placeholder="Add a description..."
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-3">Priority</label>
                                    <select
                                        name="priority"
                                        value={values.priority}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
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
                                                name="task_type"
                                                value={values.task_type}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="task">Task</option>
                                                <option value="story">Story</option>
                                                <option value="epic">Epic</option>
                                                <option value="bug">Bug</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Assignee</label>
                                            <select
                                                name="assignee_id"
                                                value={values.assignee_id}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="">Unassigned</option>
                                                <option value="user_1">User 1</option>
                                                <option value="user_2">User 2</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Due Date</label>
                                            <input
                                                type="date"
                                                name="due_date"
                                                value={values.due_date}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Status</label>
                                            <select
                                                name="status"
                                                value={values.status}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="todo">Todo</option>
                                                <option value="inprogress">In Progress</option>
                                                <option value="qa">QA</option>
                                                <option value="complete">Complete</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4 space-y-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Project'}
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
                    </form>
                </div>
            </div>
        </div>
    );
}