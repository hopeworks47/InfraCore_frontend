import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";
import type { Project, ProjectState } from "../../types/project.types";

const initialState: ProjectState = {
  projects: [],
  isLoading: false,
  error: null,
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Thunks ---

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) return rejectWithValue("No access token");
    const res = await fetch(`${API_BASE}/api/v1/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.detail || "Failed to fetch");
    return data as Project[];
  },
);

export const fetchProject = createAsyncThunk(
  "projects/fetchOne",
  async (projectId: string, { rejectWithValue }) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) return rejectWithValue("No access token");
    const res = await fetch(`${API_BASE}/api/v1/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.detail || "Failed to fetch project");
    return data as Project;
  },
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (
    formData: FormData,
    { rejectWithValue },
  ) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) return rejectWithValue("No access token");    
    const res = await fetch(`${API_BASE}/api/v1/projects/new-project`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.detail || "Creation failed");
    return data as Project;
  },
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async (
    { projectId, updates }: { projectId: string; updates: Partial<Project> },
    { rejectWithValue },
  ) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) return rejectWithValue("No access token");
    const res = await fetch(`${API_BASE}/api/v1/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.detail);
    // data should be the full updated project object from backend
    return { projectId, updates: data };
  },
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId: string, { rejectWithValue }) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) return rejectWithValue("No access token");
    const res = await fetch(`${API_BASE}/api/v1/projects/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.detail || "Deletion failed");
    }
    return projectId;
  },
);

export const addComment = createAsyncThunk(
  "projects/addComment",
  async (
    { projectId, text }: { projectId: string; text: string },
    { rejectWithValue },
  ) => {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (!token) return rejectWithValue("No access token");
    const res = await fetch(
      `${API_BASE}/api/v1/projects/${projectId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      },
    );
    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.detail || "Failed to add comment");
    }
    const comment = await res.json();
    return { projectId, comment };
  },
);

// --- Slice ---
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        const payloadProject = action.payload as Project;
        const projectId = payloadProject._id ?? payloadProject.id;
        const index = state.projects.findIndex(
          (p) => (p._id ?? p.id) === projectId,
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        } else {
          state.projects.push(action.payload);
        }
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // create
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // update
      .addCase(updateProject.fulfilled, (state, action) => {
        const { projectId, updates } = action.payload;
        const index = state.projects.findIndex((p) => p._id === projectId);
        if (index !== -1) {
          // Merge the updated fields into the existing project
          state.projects[index] = { ...state.projects[index], ...updates };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const project = state.projects.find(
          (p) => p._id === action.payload.projectId,
        );
        if (project)
          project.comments = [
            ...(project.comments || []),
            action.payload.comment,
          ];
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer;
