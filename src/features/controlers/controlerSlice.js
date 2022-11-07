import {createSlice} from '@reduxjs/toolkit'

export const controlerSlice = createSlice({
    name: 'controlers',
    initialState: {
        ip: '',
        mac: '',
        status: '',
        fases: {},
        planes:{},
    },
    reducers: {
        addFases: (state,action)=>{
            state.fases = action.payload;
        },
        addPlanes: (state,action)=>{
            state.planes = action.payload;
        },
        setInitialStateController:(state,action)=>{
            state.ip = action.payload.ip;
            state.mac = action.payload.mac;
            state.status = action.payload.status;
        }
    }
})
export const {addFases, addPlanes,setInitialStateController} = controlerSlice.actions
export default controlerSlice.reducer