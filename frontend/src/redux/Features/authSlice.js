import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
      const expirationTime = new Date().getTime() + 24 * 30 * 60 * 60 * 1000;
      localStorage.setItem('expirationTime', expirationTime);
    },
    
    Logout: state => {
      state.userInfo = null;
      localStorage.clear();
    }
  }
})

export const { setCredentials, Logout } = authSlice.actions;

export default authSlice.reducer;