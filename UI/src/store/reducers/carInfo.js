// third-party
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    carDetails: []
};

// ==============================|| SLICE - MENU ||============================== //

const carInfo = createSlice({
    name: 'carInfo',
    initialState,
    reducers: {
        setCarDetails(state, action) {
            state.carDetails = action.payload;
        }
    }
});

export default carInfo.reducer;

export const { setCarDetails } = carInfo.actions;
