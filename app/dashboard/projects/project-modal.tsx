"use client";

type ProjectModalProps = {
    isOpen: boolean;
    project: {
        title: string;
        type: string;
        assignee: string;
        due: string;
        status: string;
        description?: string;
    } | null;
    onClose: () => void;
};

export default function ProjectModal({ isOpen, project, onClose }: ProjectModalProps) {
    if (!isOpen || !project) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
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
                            <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
                            <p className="text-sm text-slate-500 mt-1">{project.type}</p>
                        </div>

                        <div className="mb-6">
                            <button className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-200 hover:bg-blue-100 transition">
                                {project.status}
                            </button>
                        </div>

                        <div className="flex gap-2 mb-8">
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition">
                                📎 Attach
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition">
                                🔗 Link issue
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition">
                                ⋯ More
                            </button>
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
                                🟡 Medium
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
                    <div className="w-80 bg-slate-50 border-l border-slate-200 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pinned fields</p>
                                <button type="button" className="text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                            <p className="text-xs text-slate-500">Click on the ⭐ next to a field label to start pinning.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">Details</h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2 block">Assignee</label>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-600">Unassigned</p>
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
                                        <p className="text-sm text-slate-600">{project.due}</p>
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
