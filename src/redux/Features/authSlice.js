import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  accessToken: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.user;
      state.accessToken = action.payload.access_token;
      console.log(action.payload);
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    Logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;
      state.loading = false;
    },
  },
});

export const { setCredentials, updateAccessToken, setLoading, Logout } = authSlice.actions;
export default authSlice.reducer;