import { configureStore } from '@reduxjs/toolkit'; // includes redux-thunk by default
import auth from './authSlice.js';
import catalog from './catalogSlice.js';
import appointments from './appointmentsSlice.js';

export default configureStore({ reducer: { auth, catalog, appointments } });
