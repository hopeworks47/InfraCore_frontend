"use client";

import { useEffect, useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { Project, BoardColumn } from "@/types/project.types";
import NewProjectButton from "./new-project-button";
import ProjectCard from "./project-card";
import ProjectModal from "./project-modal";
import NewProjectModal from "./new-project-modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects, updateProject, createProject } from "@/store/slices/projectSlice";

const initialColumns: BoardColumn[] = [];

export default function ProjectsPage() {
    const [localColumns, setLocalColumns] = useState<BoardColumn[]>((initialColumns as BoardColumn[]));
    const [draggedCard, setDraggedCard] = useState<{ fromColumn: string; card: Project } | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const dispatch = useAppDispatch();
    const projects = useAppSelector((state) => state.projects.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const columnsFromProjects = useMemo(() => {
        const groups = [
            { title: "Todo", predicate: (status: string) => status.includes("todo") },
            { title: "In Progress", predicate: (status: string) => status.includes("progress") },
            { title: "QA", predicate: (status: string) => status.includes("qa") },
            { title: "Complete", predicate: (status: string) => status.includes("complete") },
            { title: "Done", predicate: (status: string) => status.includes("done") },
        ];

        return groups.map(({ title, predicate }) => ({
            title,
            cards: projects.filter((project) => predicate(project.status.toLowerCase())),
        }));
    }, [projects]);

    const columns = projects.length ? columnsFromProjects : localColumns;

    const handleDragStart = (columnTitle: string, card: Project) => (event: DragEvent<HTMLDivElement>) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", JSON.stringify({ fromColumn: columnTitle, title: card.title }));
        setDraggedCard({ fromColumn: columnTitle, card });
    };

    const handleDragEnd = () => {
        setDraggedCard(null);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (targetColumn: string) => {
        if (!draggedCard) {
            return;
        }

        if (draggedCard.fromColumn === targetColumn) {
            setDraggedCard(null);
            return;
        }

        const draggedId = draggedCard.card._id;

        if (draggedId) {
            // Find the current project and create full updated project
            const currentProject = projects.find((p) => p._id === draggedId);
            if (currentProject) {
                const updatedProject = { ...currentProject, status: targetColumn };
                dispatch(updateProject({ projectId: draggedId, updates: updatedProject }));
            }
        } else {
            // Update local columns
            setLocalColumns((currentColumns) => {
                const sourceColumn = currentColumns.find((column) => column.title === draggedCard.fromColumn);
                const destinationColumn = currentColumns.find((column) => column.title === targetColumn);
                if (!sourceColumn || !destinationColumn) {
                    return currentColumns;
                }

                const cardToMove = sourceColumn.cards.find((item) => item.title === draggedCard.card.title);
                if (!cardToMove) {
                    return currentColumns;
                }

                const movedCard = { ...cardToMove, status: targetColumn };

                return currentColumns.map((column) => {
                    if (column.title === draggedCard.fromColumn) {
                        return {
                            ...column,
                            cards: column.cards.filter((item) => item.title !== draggedCard.card.title)
                        };
                    }

                    if (column.title === targetColumn) {
                        return {
                            ...column,
                            cards: [...column.cards, movedCard]
                        };
                    }

                    return column;
                });
            });
        }

        setDraggedCard(null);
    };

    const handleCardClick = (card: Project) => {
        setSelectedProject(card);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    const handleNewProjectOpen = () => {
        setIsNewProjectModalOpen(true);
    };

    const handleNewProjectClose = () => {
        setIsNewProjectModalOpen(false);
    };

    const handleNewProjectSubmit = (project: Project) => {
        if (projects.length > 0) {
            // Dispatch createProject to store
            const formData = new FormData();
            formData.append('title', project.title);
            formData.append('description', project.description || '');
            formData.append('task_type', project.task_type);
            formData.append('priority', project.priority);
            formData.append('status', project.status);
            if (project.due_date) {
                formData.append('due_date', project.due_date);
            }
            // assignee_id if needed
            dispatch(createProject(formData));
        } else {
            // Add to local columns
            const todoColumn = localColumns.find((col) => col.title === "Todo");
            if (todoColumn) {
                todoColumn.cards.push(project);
                setLocalColumns([...localColumns]);
            }
        }
        handleNewProjectClose();
    };

    return (
        <div className="space-y-6">
            <ProjectModal isOpen={Boolean(selectedProject)} project={selectedProject} onClose={closeModal} />
            <NewProjectModal isOpen={isNewProjectModalOpen} onClose={handleNewProjectClose} onSubmit={handleNewProjectSubmit} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Projects</h1>                    
                </div>                
            </div>

            <div className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Job Board</p>
                        
                    </div>
                    <NewProjectButton onOpen={handleNewProjectOpen} />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                    {columns.map((column) => (
                        <div
                            key={column.title}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(column.title)}
                            className="min-w-[280px] border border-slate-200 bg-slate-50 p-4 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold">{column.title}</h3>
                                    <p className="text-sm text-slate-500">{column.cards.length} items</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {column.cards.map((card) => (
                                    <ProjectCard
                                        key={`${column.title}-${card._id ?? card.title}`}
                                        title={card.title}
                                        type={card.task_type}
                                        assignee={card.assignee_id || "Unassigned"}
                                        due={card.due_date || "No due date"}
                                        onClick={() => handleCardClick(card)}
                                        onDragStart={handleDragStart(column.title, card)}
                                        onDragEnd={handleDragEnd}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
