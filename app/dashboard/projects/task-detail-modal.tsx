"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  Project,
  updateProject,
  deleteProject,
  addComment,
} from "@/store/slices/projectSlice";

export default function TaskDetailModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: project.name,
    description: project.description || "",
    priority: project.priority,
    due_date: project.due_date?.split("T")[0] || "",
    assignee_id: project.assignee_id || "",
  });
  const [newComment, setNewComment] = useState("");

  const handleSave = async () => {
    await dispatch(updateProject({ projectId: project._id, updates: form }));
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (confirm("Delete this task?")) {
      await dispatch(deleteProject(project._id));
      onClose();
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await dispatch(addComment({ projectId: project._id, text: newComment }));
    setNewComment("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:rounded-lg md:max-w-4xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          {editMode ? (
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="text-xl font-bold border rounded px-2 py-1"
            />
          ) : (
            <h2 className="text-xl font-bold">{project.name}</h2>
          )}
          <div className="space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-3 py-1 border rounded"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-red-600 border rounded"
            >
              Delete
            </button>
            <button onClick={onClose} className="px-3 py-1 border rounded">
              Close
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            {editMode ? (
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="w-full border rounded p-2"
              />
            ) : (
              <p className="text-gray-700">
                {project.description || "No description"}
              </p>
            )}
          </div>

          {/* Priority, Due Date, Assignee */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Priority</label>
              {editMode ? (
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as any })
                  }
                  className="w-full border rounded p-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <p className="capitalize">{project.priority}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Due Date</label>
              {editMode ? (
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) =>
                    setForm({ ...form, due_date: e.target.value })
                  }
                  className="w-full border rounded p-1"
                />
              ) : (
                <p>
                  {project.due_date
                    ? new Date(project.due_date).toLocaleDateString()
                    : "None"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">
                Assignee (User ID)
              </label>
              {editMode ? (
                <input
                  value={form.assignee_id}
                  onChange={(e) =>
                    setForm({ ...form, assignee_id: e.target.value })
                  }
                  className="w-full border rounded p-1"
                  placeholder="User ID"
                />
              ) : (
                <p>{project.assignee_name || "Unassigned"}</p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium">Comments</label>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2 mb-2">
              {project.comments?.map((c, i) => (
                <div key={i} className="bg-gray-50 p-2 rounded">
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-400">
                    — {c.created_by} on{" "}
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border rounded p-2"
              />
              <button
                onClick={handleAddComment}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
