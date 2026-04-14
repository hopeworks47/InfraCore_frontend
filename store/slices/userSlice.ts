import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "../../types/user.types";

const initialState: UserState = {
  name: null,
  email: null,
  profileImage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
