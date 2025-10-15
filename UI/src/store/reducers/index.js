// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import snackbar from './snackbar';
import auth from './auth';
import lookup from './lookup';
import carInfo from './carInfo'

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  snackbar,
  auth,
  lookup,
  carInfo
});

export default reducers;
