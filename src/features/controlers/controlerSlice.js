import {createSlice} from '@reduxjs/toolkit'

export const controlerSlice = createSlice({
    name: 'controlers',
    initialState: {
        ip: '',
        mac: '',
        fases: '',
    },
    reducers: {
        
    }
})

export default controlerSlice.reducer