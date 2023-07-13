import { combineReducers, configureStore } from '@reduxjs/toolkit';
import controlerSlice from '../features/controlers/controlerSlice';
import menuSlice from '../features/menu/menuSlice';
import userSlice from '../features/auth/userSlice';
import controlerHT200Slice from '../features/controlerht200/controlerHT200Slice';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
const reducers = combineReducers({
  controlers:controlerSlice,
  controlerht200:controlerHT200Slice,
  menu: menuSlice,
  auth:userSlice,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)
export  const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})


export const persistor = persistStore(store)