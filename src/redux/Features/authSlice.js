import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // only stored in memory
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload; // includes access_token
    },

    updateAccessToken: (state, action) => {
      if (state.userInfo) {
        state.userInfo.access_token = action.payload;
      }
    },

    Logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, updateAccessToken, Logout } = authSlice.actions;
export default authSlice.reducer;
