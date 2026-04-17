import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";
import type { UserState } from "../../types/user.types";

const initialState: UserState = {
  name: null,
  email: null,
  profile_image: null,
};

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (
    { userId, updateData }: { userId: string; updateData: FormData | Partial<UserState> },
    { rejectWithValue },
  ) => {
    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (!token) {
        return rejectWithValue("No access token available");
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
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
        const errorData = await response.json().catch(() => ({ message: "Update failed" }));
        return rejectWithValue(errorData.message || "Update failed");
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Update failed");
    }
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
      .addCase(updateUser.fulfilled, (state, action) => {
        // Update the state with the updated user data if it's the current user
        return { ...state, ...action.payload };
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
