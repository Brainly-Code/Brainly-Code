import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { id: number, email: string, role: string, isPremium: boolean }
  accessToken: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.access_token;
      state.loading = false;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    Logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
    },
  },
});

export const { setCredentials, updateAccessToken, setLoading, Logout } = authSlice.actions;
export default authSlice.reducer;