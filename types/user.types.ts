// User related types
export interface TeamMember {
    _id: string;
    name: string;
    email: string;
    role?: "admin" | "leader" | "member";
    created_at?: string;
    profile_image?: string;
}

export interface UserProfile {
    name: string | null;
    email: string | null;
    profile_image: string | null;
}

export interface UserState {
    name: string | null;
    email: string | null;
    profile_image: string | null;
    users?: TeamMember[]; // For team management
    lastDeleteMessage?: string; // For delete operation feedback
}
