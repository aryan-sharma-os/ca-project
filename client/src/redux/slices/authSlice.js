import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data; // server returns user object { id, name, email, role }
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Login failed' });
  }
});

export const registerUser = createAsyncThunk('auth/register', async ({ name, email, password, role }, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/auth/register', { name, email, password, role });
    return res.data; // returns created user (no token)
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Registration failed' });
  }
});

const saved = (() => {
  try { return JSON.parse(localStorage.getItem('auth')) || null; } catch { return null; }
})();

const slice = createSlice({
  name: 'auth',
  initialState: { user: saved?.user || null, token: null, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null; state.token = null; state.error = null; state.loading = false;
      localStorage.removeItem('auth');
    }
  },
  extraReducers: (b) => {
    b.addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(loginUser.fulfilled, (s, a) => {
      s.loading = false; s.user = a.payload; s.token = null; s.error = null;
      localStorage.setItem('auth', JSON.stringify({ user: s.user }));
    });
    b.addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Login failed'; });

    b.addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(registerUser.fulfilled, (s) => { s.loading = false; s.error = null; });
    b.addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Registration failed'; });
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
