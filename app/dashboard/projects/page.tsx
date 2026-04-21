"use client";

import { useState } from "react";
import type { DragEvent } from "react";
import type { ProjectItem, BoardColumn } from "@/types/project.types";
import NewProjectButton from "./new-project-button";
import ProjectCard from "./project-card";
import ProjectModal from "./project-modal";
import NewProjectModal from "./new-project-modal";

const initialColumns: BoardColumn[] = [
    {
        title: "Todo",
        cards: [
            {
                title: "Set up project schema",
                type: "Task",
                assignee: "Ava",
                due: "Apr 15",
                status: "Todo",
                description: "Create the base project schema and wire up the initial data model."
            },
            {
                title: "Review onboarding flow",
                type: "Story",
                assignee: "Noah",
                due: "Apr 17",
                status: "Todo",
                description: "Review the new user onboarding steps and ensure flows are intuitive."
            }
        ]
    },
    {
        title: "In Progress",
        cards: [
            {
                title: "Job board UI design",
                type: "Epic",
                assignee: "Mia",
                due: "Apr 12",
                status: "In Progress",
                description: "Design the Jira-style job board layout with draggable cards and clear statuses."
            }
        ]
    },
    {
        title: "QA",
        cards: [
            {
                title: "Validate test coverage",
                type: "Task",
                assignee: "Ethan",
                due: "Apr 14",
                status: "QA",
                description: "Complete QA checks and verify the board behavior matches acceptance criteria."
            }
        ]
    },
    {
        title: "Complete",
        cards: [
            {
                title: "Finalize release notes",
                type: "Story",
                assignee: "Liam",
                due: "Apr 10",
                status: "Complete",
                description: "Prepare release notes and ensure all completed items are documented."
            }
        ]
    },
    {
        title: "Done",
        cards: [
            {
                title: "Add user auth flow",
                type: "Task",
                assignee: "Olivia",
                due: "Apr 9",
                status: "Done",
                description: "User authentication flow is complete and ready for final verification."
            }
        ]
    }
];

export default function ProjectsPage() {
    const [columns, setColumns] = useState<BoardColumn[]>(initialColumns);
    const [draggedCard, setDraggedCard] = useState<{ fromColumn: string; card: ProjectItem } | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

    const handleDragStart = (columnTitle: string, card: ProjectItem) => (event: DragEvent<HTMLDivElement>) => {
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

        setColumns((currentColumns) => {
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

        setDraggedCard(null);
    };

    const handleCardClick = (card: ProjectItem) => {
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

    const handleNewProjectSubmit = (project: Omit<ProjectItem, "id">) => {
        const todoColumn = columns.find((col) => col.title === "Todo");
        if (todoColumn) {
            todoColumn.cards.push(project);
            setColumns([...columns]);
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
                                        key={`${column.title}-${card.title}`}
                                        title={card.title}
                                        type={card.type}
                                        assignee={card.assignee}
                                        due={card.due}
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
