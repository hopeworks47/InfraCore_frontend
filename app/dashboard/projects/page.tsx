"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProjects,
  updateProject,
  Project,
} from "@/store/slices/projectSlice";
import { useSession } from "next-auth/react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import CreateProjectModal from "./create-project-modal";
import TaskDetailModal from "./task-detail-modal";
import Column from "./column";

const columns: Project["status"][] = ["todo", "inprogress", "qa", "complete"];

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, isLoading, error } = useAppSelector(
    (state) => state.projects,
  );
  const { data: session, status } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (status === "authenticated") dispatch(fetchProjects());
  }, [status, dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeProject = projects.find((p) => p._id === active.id);
    if (!activeProject) return;

    // Determine new status
    let newStatus: Project["status"] | null = null;
    if (over.data.current?.sortable?.containerId) {
      // Dropped on a card – get its column container id
      newStatus = over.data.current.sortable.containerId as Project["status"];
    } else if (
      ["todo", "inprogress", "qa", "complete"].includes(over.id as string)
    ) {
      // Dropped directly on column background
      newStatus = over.id as Project["status"];
    }

    if (newStatus && activeProject.status !== newStatus) {
      // Optimistically update local state first (optional, but Redux will update after thunk)
      dispatch(
        updateProject({
          projectId: activeProject._id,
          updates: { status: newStatus },
        }),
      );
    }
  };

  const getProjectsByStatus = (status: Project["status"]) =>
    projects.filter((p) => p.status === status);

  if (isLoading) return <div className="p-6">Loading projects...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects Board</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          + Add Task
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((status) => (
            <Column
              key={status}
              id={status}
              title={
                {
                  todo: "ToDo",
                  inprogress: "In Progress",
                  qa: "QA",
                  complete: "Complete",
                }[status]
              }
              projects={projects.filter((p) => p.status === status)}
              onProjectClick={setSelectedProject}
            />
          ))}
        </div>
      </DndContext>

      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      {selectedProject && (
        <TaskDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
