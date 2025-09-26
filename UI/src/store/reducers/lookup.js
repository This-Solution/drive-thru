// third-party
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  roles: [],
  flavours: [],
  tenants: [],
  cameraConfig: [],
  sites: [],
  lastCars: []
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
    },

    setSites(state, action) {
      state.sites = action.payload;
    },

    setLastCars(state, action) {
      state.lastCars = action.payload;
    }
  }
});

export default lookup.reducer;

export const { setLookup, clearLookup, setTenant, setCameraConfig, setSites, setLastCars } = lookup.actions;
