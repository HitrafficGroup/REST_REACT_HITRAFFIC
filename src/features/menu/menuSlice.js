import {createSlice} from '@reduxjs/toolkit'

export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menu: 'Dashboard Hitraffic',
    },
    reducers: {
        setNameMenu: (state,action)=>{
            state.menu = action.payload;
        },
    }
})
export const {setNameMenu} = menuSlice.actions
export default menuSlice.reducer