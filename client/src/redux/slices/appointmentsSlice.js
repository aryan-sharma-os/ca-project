import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchMyAppointments = createAsyncThunk('appointments/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/appointments');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to load appointments' });
  }
});

export const createAppointment = createAsyncThunk('appointments/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/appointments', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to create appointment' });
  }
});

export const updateAppointment = createAsyncThunk('appointments/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/api/appointments/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to update appointment' });
  }
});

export const cancelAppointment = createAsyncThunk('appointments/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/api/appointments/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to cancel appointment' });
  }
});

export const rescheduleAppointment = createAsyncThunk('appointments/reschedule', async ({ id, startTime, endTime }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/api/appointments/reschedule/${id}`, { startTime, endTime });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to reschedule appointment' });
  }
});

export const deleteAppointmentHard = createAsyncThunk('appointments/deleteHard', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/api/appointments/hard/${id}`);
    return res.data; // { _id, deleted: true }
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to delete appointment' });
  }
});

const slice = createSlice({
  name: 'appointments',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMyAppointments.pending, (s)=>{ s.loading = true; s.error = null; });
    b.addCase(fetchMyAppointments.fulfilled, (s,a)=>{ s.loading = false; s.items = a.payload; });
    b.addCase(fetchMyAppointments.rejected, (s,a)=>{ s.loading = false; s.error = a.payload?.message; });

      b.addCase(createAppointment.fulfilled, (s,a)=>{ s.error = null; s.items.push(a.payload); });
      b.addCase(createAppointment.rejected, (s,a)=>{ s.error = a.payload?.message || 'Failed to create appointment'; });
      b.addCase(updateAppointment.fulfilled, (s,a)=>{ s.error = null; const i = s.items.findIndex(x=>x._id===a.payload._id); if(i>=0) s.items[i]=a.payload; });
      b.addCase(updateAppointment.rejected, (s,a)=>{ s.error = a.payload?.message || 'Failed to update appointment'; });
      b.addCase(cancelAppointment.fulfilled, (s,a)=>{ s.error = null; const i = s.items.findIndex(x=>x._id===a.payload._id); if(i>=0) s.items[i]=a.payload; });
      b.addCase(cancelAppointment.rejected, (s,a)=>{ s.error = a.payload?.message || 'Failed to cancel appointment'; });
      b.addCase(rescheduleAppointment.fulfilled, (s,a)=>{ s.error = null; const i = s.items.findIndex(x=>x._id===a.payload._id); if(i>=0) s.items[i]=a.payload; });
      b.addCase(rescheduleAppointment.rejected, (s,a)=>{ s.error = a.payload?.message || 'Failed to reschedule appointment'; });
      b.addCase(deleteAppointmentHard.fulfilled, (s,a)=>{ s.error = null; s.items = s.items.filter(x=>x._id !== (a.payload._id || a.meta.arg)); });
      b.addCase(deleteAppointmentHard.rejected, (s,a)=>{ s.error = a.payload?.message || 'Failed to delete appointment'; });
  }
});

export default slice.reducer;
