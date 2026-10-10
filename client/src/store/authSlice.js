import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errMsg } from '../utils/api.js';

const call = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try { return (await fn(arg)).data; } catch (e) { return rejectWithValue(errMsg(e)); }
  });

export const login = call('auth/login', (d) => api.post('/auth/login', d));
export const register = call('auth/register', (d) => api.post('/auth/register', d));
export const updateProfile = call('auth/update', (d) => api.put('/auth/me', d));

const saved = localStorage.getItem('user');
const slice = createSlice({
  name: 'auth',
  initialState: { user: saved ? JSON.parse(saved) : null, token: localStorage.getItem('token'), loading: false },
  reducers: {
    logout(state) {
      state.user = null; state.token = null;
      localStorage.removeItem('token'); localStorage.removeItem('user');
    }
  },
  extraReducers: (b) => {
    const session = (state, { payload }) => {
      state.loading = false; state.user = payload.user; state.token = payload.token;
      localStorage.setItem('token', payload.token); localStorage.setItem('user', JSON.stringify(payload.user));
    };
    b.addCase(login.fulfilled, session).addCase(register.fulfilled, session)
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.loading = false; state.user = payload; localStorage.setItem('user', JSON.stringify(payload));
      });
    [login, register, updateProfile].forEach((t) =>
      b.addCase(t.pending, (s) => { s.loading = true; }).addCase(t.rejected, (s) => { s.loading = false; })
    );
  }
});
export const { logout } = slice.actions;
export default slice.reducer;
