import { combineReducers, configureStore } from '@reduxjs/toolkit'
import controlerSlice from '../features/controlers/controlerSlice'
import menuSlice from '../features/menu/menuSlice'


const reducers = combineReducers({
  controlers:controlerSlice,
  menu: menuSlice,
})

export  const store = configureStore({

  reducer:reducers

})