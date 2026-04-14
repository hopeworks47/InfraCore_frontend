import type { DefaultSession } from "next-auth";

// NextAuth module augmentations
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            accessToken: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
    }
}

// User authentication types
export interface AuthUser {
    _id: string;
    email: string;
    name?: string;
    role: string;
    profileImage: File | null;
    birthDate?: string;
    accessToken?: string;
}

export interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
}

export type LoginCredentials = {
    email: string;
    password: string;
};
