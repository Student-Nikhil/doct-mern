import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { errMsg } from '../utils/api.js';

const call = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try { return (await fn(arg)).data; } catch (e) { return rejectWithValue(errMsg(e)); }
  });

export const fetchDoctors = call('catalog/doctors', (params) => api.get('/doctors', { params }));
export const fetchSpecialties = call('catalog/specialties', () => api.get('/doctors/specialties'));
export const fetchServices = call('catalog/services', () => api.get('/services'));

export default createSlice({
  name: 'catalog',
  initialState: { doctors: [], specialties: [], services: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDoctors.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchDoctors.fulfilled, (s, a) => { s.loading = false; s.doctors = a.payload; })
      .addCase(fetchDoctors.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchSpecialties.fulfilled, (s, a) => { s.specialties = a.payload; })
      .addCase(fetchServices.fulfilled, (s, a) => { s.services = a.payload; });
  }
}).reducer;
