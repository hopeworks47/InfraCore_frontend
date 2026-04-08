'use client';

import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './task-card';
import { Project } from '@/store/slices/projectSlice';

interface ColumnProps {
  id: string;
  title: string;
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function Column({ id, title, projects, onProjectClick }: ColumnProps) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-50 rounded-md p-3 w-72 flex-shrink-0">
      <h2 className="font-semibold text-gray-700 mb-3">{title} ({projects.length})</h2>
      <SortableContext items={projects.map(p => p._id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[200px]">
          {projects.map(project => (
            <TaskCard key={project._id} project={project} onClick={() => onProjectClick(project)} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}