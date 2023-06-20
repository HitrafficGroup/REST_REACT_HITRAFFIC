import { combineReducers, configureStore } from '@reduxjs/toolkit';
import controlerSlice from '../features/controlers/controlerSlice';
import menuSlice from '../features/menu/menuSlice';
import userSlice from '../features/auth/userSlice';
import controlerHT200Slice from '../features/controlerht200/controlerHT200Slice';

const reducers = combineReducers({
  controlers:controlerSlice,
  controlerht200:controlerHT200Slice,
  menu: menuSlice,
  auth:userSlice,
})

export  const store = configureStore({

  reducer:reducers

})