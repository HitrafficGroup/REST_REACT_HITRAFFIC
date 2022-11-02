import { configureStore } from '@reduxjs/toolkit'
import controlerSlice from '../features/controlers/controlerSlice'
export  const store = configureStore({

  reducer:{
    controlers: controlerSlice,
  }

})