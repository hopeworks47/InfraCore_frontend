import type { DragEvent, ReactNode } from "react";
import type { Project } from "./project.types";

// Props types for components
export interface ProvidersProps {
    children: ReactNode;
}

export interface ProjectCardProps {
    title: string;
    type: string;
    assignee: string;
    due: string;
    onClick?: () => void;
    onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
    onDragEnd?: () => void;
}

export interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project?: Project | null;
}

export interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (project: Project) => void;
}

export interface NewProjectButtonProps {
    label?: string;
    onClick?: () => void;
    onOpen?: () => void;
}

export interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member?: any; // TODO: Define member type if needed
    onSubmit?: (data: any) => void;
}
