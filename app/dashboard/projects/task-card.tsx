'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '@/store/slices/projectSlice';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TaskCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800">{project.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[project.priority]}`}>{project.priority}</span>
      </div>
      {project.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
        <span>{project.assignee_name || 'Unassigned'}</span>
        {project.due_date && <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>}
      </div>
    </div>
  );
}