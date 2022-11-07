import {createSlice} from '@reduxjs/toolkit'

export const controlerSlice = createSlice({
    name: 'controlers',
    initialState: {
        ip: '',
        mac: '',
        fases: {},
        planes:{},
    },
    reducers: {
        addFases: (state,action)=>{
            state.fases = action.payload;
        },
        addPlanes: (state,action)=>{
            state.planes = action.payload;
        }
    }
})
export const {addFases, addPlanes} = controlerSlice.actions
export default controlerSlice.reducer