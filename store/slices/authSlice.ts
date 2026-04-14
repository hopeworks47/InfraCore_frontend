import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signIn, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import type { AuthState, AuthUser } from "../../types/auth.types";

// Type alias for backward compatibility
type User = AuthUser;

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
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
    } catch {
      return rejectWithValue("Login failed");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.detail || "Registration failed");
      }
      // After registration, auto-login (optional)
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      await signIn("credentials", { email, password, redirect: false });
      return data;
    } catch {
      return rejectWithValue("Network Error");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await signOut({ redirect: false });
  return null;
});

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (!token) {
        return rejectWithValue("No access token");
      }
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${apiBaseUrl}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.detail);
      return data;
    } catch {
      return rejectWithValue("Failed to fetch user");
    }
  },
);
const authSlice = createSlice({
  name: "auth",
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
      })
      // ✅ Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
