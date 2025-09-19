// third-party
import { createSlice } from '@reduxjs/toolkit';
import utils from 'utils/utils';

// initial state
const initialState = {
  user: null,
  flavour: null,
  sessionToken: null,
  refreshToken: null,
  isUserLogout: false,
  isLoading: true,
};

// ==============================|| SLICE - MENU ||============================== //

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.sessionToken = token?.session;
      state.refreshToken = token?.refresh;
      utils.setTokensToStorage(token);
    },
    setTokens(state, action) {
      const { token } = action.payload;

      if (token) {
        state.sessionToken = token?.session;
        if (token?.refresh != null) {
          state.refreshToken = token.refresh;
        }
      } else {
        state.isLoading = false;
      }
    },
    setUser(state, action) {
      const { user } = action.payload;
      state.user = user;
      state.isLoading = false;
    },
    setAuthDetail(state, action) {
      const { user, token } = action.payload;

      state.sessionToken = token.session;
      if (token.refresh) {
        state.refreshToken = token.refresh;
      }

      if (user) {
        state.user = user;
        state.isLoading = false;
      }
    },
    setFlavour(state, action) {
      const { flavour } = action.payload;
      state.flavour = flavour;
    },
    logout(state, action) {
      state.refreshToken = null;
      state.sessionToken = null;
      state.isUserLogout = action.payload ? true : false;
      state.user = null;
      state.flavour = null;
      utils.clearLocalStorage();
    }
  }
});

export default auth.reducer;

export const { login, setUser, logout, setTokens, setAuthDetail, setFlavour } = auth.actions;
