import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signIn, signOut } from "next-auth/react";

interface User {
    _id: string;
    email: string;
    name?: string;
    role: string;
    profileImage?: string;
    birthDate?: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk("auth/login", async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
        const response = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (response?.error) {
            return rejectWithValue(response.error);
        }

        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();
        return session.user;
    } catch (error) {
        return rejectWithValue("Login failed: " + error);
    }
});

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: {
        email: string;
        password: string;
        name: string;
        role: string;
        profileImage?: string;
        birthDate?: string;
    }, { rejectWithValue }) => {
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const res = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
              });
              const data = await res.json();
              if (!res.ok) {
                return rejectWithValue(data.detail || 'Registration failed');
              }
              // After registration, auto-login (optional)
              await signIn('credentials', {
                email: userData.email,
                password: userData.password,
                redirect: false,
              });
              return data; // contains user info
        } catch (error) {
            return rejectWithValue('Network Error');
        }
    }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await signOut({ redirect: false });
    return null;
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
