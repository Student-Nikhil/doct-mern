import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errMsg } from '../utils/api.js';

const call = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try { return (await fn(arg)).data; } catch (e) { return rejectWithValue(errMsg(e)); }
  });

export const fetchAppointments = call('appts/fetch', () => api.get('/appointments'));
export const bookAppointment = call('appts/book', (form) => api.post('/appointments', form));
export const cancelAppointment = call('appts/cancel', (id) => api.patch(`/appointments/${id}/cancel`));

export default createSlice({
  name: 'appointments',
  initialState: { items: [], loading: false, saving: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAppointments.pending, (s) => { s.loading = true; })
      .addCase(fetchAppointments.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchAppointments.rejected, (s) => { s.loading = false; })
      .addCase(bookAppointment.pending, (s) => { s.saving = true; })
      .addCase(bookAppointment.fulfilled, (s, a) => { s.saving = false; s.items.unshift(a.payload); })
      .addCase(bookAppointment.rejected, (s) => { s.saving = false; })
      .addCase(cancelAppointment.fulfilled, (s, a) => {
        s.items = s.items.map((x) => (x._id === a.payload._id ? a.payload : x));
      });
  }
}).reducer;
