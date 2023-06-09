import { combineReducers, configureStore } from '@reduxjs/toolkit'
import controlerSlice from '../features/controlers/controlerSlice'
import menuSlice from '../features/menu/menuSlice'
import userSlice from '../features/auth/userSlice'


const reducers = combineReducers({
  controlers:controlerSlice,
  menu: menuSlice,
  auth:userSlice,
})

export  const store = configureStore({

  reducer:reducers

})