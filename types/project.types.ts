// Project and task related types
export interface Comment {
    text: string;
    created_by: string;
    created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  priority: string;
  task_type: string;  
  assignee_id?: string;
  due_date?: string;
  status: string;
  attachment?: string;
  created_at: string;
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
