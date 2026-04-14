// Project and task related types
export interface Comment {
    text: string;
    created_by: string;
    created_at: string;
}

export interface Project {
    _id: string;
    name: string;
    description?: string;
    status: "todo" | "inprogress" | "qa" | "complete";
    priority: "low" | "medium" | "high";
    assignee_id?: string;
    assignee_name?: string;
    due_date?: string;
    comments?: Comment[];
    created_at: string;
    updated_at?: string;
}

export interface ProjectItem {
    title: string;
    type: string;
    assignee: string;
    due: string;
    status: string;
    description?: string;
}

export interface BoardColumn {
    title: string;
    cards: ProjectItem[];
}

export interface ProjectFormData {
    title: string;
    type: string;
    assignee: string;
    due: string;
    status: string;
    description: string;
}

export interface ProjectState {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
}
