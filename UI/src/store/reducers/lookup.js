// third-party
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  roles: [],
  flavours: [],
  tenants: [],
  cameraConfig: []
};

// ==============================|| SLICE - MENU ||============================== //

const lookup = createSlice({
  name: 'lookup',
  initialState,
  reducers: {
    setLookup(state, action) {
      state.roles = action.payload;
      state.flavours = action.payload;
    },

    clearLookup(state) {
      state.roles = [];
    },

    setTenant(state, action) {
      const { tenants } = action.payload;
      state.tenants = tenants;
    },

    setCameraConfig(state, action) {
      state.cameraConfig = action.payload;
    }
  }
});

export default lookup.reducer;

export const { setLookup, clearLookup, setTenant, setCameraConfig } = lookup.actions;
