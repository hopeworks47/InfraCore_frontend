// Project and task related types
export interface Comment {
    text: string;
    created_by: string;
    created_at: string;
}

export interface Project {  
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  priority: string;
  task_type: string;  
  assignee_id?: string;
  due_date?: string;
  status: string;
  attachment?: string;
  created_at: string;
  comments?: Comment[];
}

export interface BoardColumn {
    title: string;
    cards: Project[];
}

export interface ProjectState {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
}
