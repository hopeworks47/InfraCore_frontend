'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { createProject } from '@/store/slices/projectSlice';

export default function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    await dispatch(createProject({ name: name.trim(), description: description.trim(), priority }));
    setIsSubmitting(false);
    onClose();
    setName('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Task Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2" required autoFocus />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border rounded p-2" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full border rounded p-2">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}