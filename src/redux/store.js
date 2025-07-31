import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Features/authSlice'
import { apiSlice } from './api/apiSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleWare => getDefaultMiddleWare().concat(apiSlice.middleware),
  devTools: true,
})

export default store