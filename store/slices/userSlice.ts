import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";
import type { UserState } from "../../types/user.types";

const initialState: UserState = {
  name: null,
  email: null,
  profile_image: null,
  users: [],
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData: FormData, { rejectWithValue }) => {
    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (!token) {
        return rejectWithValue("No access token available");
      }

      if (!apiBaseUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
      }

      const response = await fetch(`${apiBaseUrl}/api/v1/users/new-member`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: userData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Add user failed" }));
        return rejectWithValue(errorData.message || "Add user failed");
      }

      const newUser = await response.json();
      return newUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Add user failed",
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (
    {
      userId,
      updateData,
    }: { userId: string; updateData: FormData | Partial<UserState> },
    { rejectWithValue },
  ) => {
    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (!token) {
        return rejectWithValue("No access token available");
      }

      if (!apiBaseUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
      }

      const isFormData = updateData instanceof FormData;
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${apiBaseUrl}/api/v1/users/${userId}`, {
        method: "PUT",
        headers,
        body: isFormData ? updateData : JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Update failed" }));
        return rejectWithValue(errorData.message || "Update failed");
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Update failed",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userId: string, { rejectWithValue }) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) return rejectWithValue("No access token");

    const res = await fetch(`${apiBaseUrl}/api/v1/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      // Use the backend error message if available
      return rejectWithValue(data.message || data.detail || "Deletion failed");
    }

    // Success – return the message and the deleted user ID
    return { message: data.message, deletedUserId: userId };
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.fulfilled, (state, action) => {
        // Add the new user to the users array if it exists
        if (state.users) {
          state.users.push(action.payload);
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        // Update the state with the updated user data if it's the current user
        return { ...state, ...action.payload };
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const { deletedUserId, message } = action.payload;
        if (state.users) {
          state.users = state.users.filter((user) => user._id !== deletedUserId);
        }
        state.lastDeleteMessage = message;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
