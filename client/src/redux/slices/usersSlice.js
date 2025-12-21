import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchUsers = createAsyncThunk('users/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/users');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to load users' });
  }
});

const slice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s)=>{ s.loading = true; s.error = null; });
    b.addCase(fetchUsers.fulfilled, (s,a)=>{ s.loading = false; s.items = a.payload; });
    b.addCase(fetchUsers.rejected, (s,a)=>{ s.loading = false; s.error = a.payload?.message; });
  }
});

export default slice.reducer;
