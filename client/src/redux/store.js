import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import appointmentsReducer from './slices/appointmentsSlice.js';
import prescriptionsReducer from './slices/prescriptionsSlice.js';
import usersReducer from './slices/usersSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    prescriptions: prescriptionsReducer,
    users: usersReducer
  }
});
