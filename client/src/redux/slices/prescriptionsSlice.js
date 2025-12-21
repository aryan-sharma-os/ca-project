import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchPrescriptions = createAsyncThunk('prescriptions/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/prescriptions');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to load prescriptions' });
  }
});

export const createPrescription = createAsyncThunk('prescriptions/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/prescriptions', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to create prescription' });
  }
});

const slice = createSlice({
  name: 'prescriptions',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPrescriptions.pending, (s)=>{ s.loading = true; s.error = null; });
    b.addCase(fetchPrescriptions.fulfilled, (s,a)=>{ s.loading = false; s.items = a.payload; });
    b.addCase(fetchPrescriptions.rejected, (s,a)=>{ s.loading = false; s.error = a.payload?.message; });
    b.addCase(createPrescription.fulfilled, (s,a)=>{ s.items.unshift(a.payload); });
  }
});

export default slice.reducer;
