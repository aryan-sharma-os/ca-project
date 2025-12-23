import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchDoctorProfile = createAsyncThunk('doctor/profile/get', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/doctor/profile');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to load profile' });
  }
});

export const updateDoctorProfile = createAsyncThunk('doctor/profile/update', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.put('/api/doctor/profile', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to update profile' });
  }
});

const slice = createSlice({
  name: 'doctor',
  initialState: { profile: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDoctorProfile.pending, (s)=>{ s.loading = true; s.error = null; });
    b.addCase(fetchDoctorProfile.fulfilled, (s,a)=>{ s.loading = false; s.profile = a.payload; });
    b.addCase(fetchDoctorProfile.rejected, (s,a)=>{ s.loading = false; s.error = a.payload?.message; });

    b.addCase(updateDoctorProfile.pending, (s)=>{ s.loading = true; s.error = null; });
    b.addCase(updateDoctorProfile.fulfilled, (s,a)=>{ s.loading = false; s.profile = a.payload; });
    b.addCase(updateDoctorProfile.rejected, (s,a)=>{ s.loading = false; s.error = a.payload?.message; });
  }
});

export default slice.reducer;
