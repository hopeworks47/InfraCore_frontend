// User related types
export interface TeamMember {
    _id: string;
    name: string;
    email: string;
}

export interface UserProfile {
    name: string | null;
    email: string | null;
    profileImage: string | null;
}

export interface UserState {
    name: string | null;
    email: string | null;
    profileImage: string | null;
}
