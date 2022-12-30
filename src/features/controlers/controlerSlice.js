import {createSlice} from '@reduxjs/toolkit'

export const controlerSlice = createSlice({
    name: 'controlers',
    initialState: {
        ip: '',
        mac: '',
        status: '',
        latitud: '',
        longitud:'',
        fases: {},
        nombre:'',
        planes:{},
        resumen:{
            horas: '00',
            minutos: '00',
            pasos:[]
        },
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
            state.nombre = action.payload.nombre;
            state.latitud = action.payload.latitud;
            state.longitud = action.payload.longitud;

        },
        setResumen:(state,action)=>{
            state.resumen = action.payload;
        }
    }
})
export const {addFases, addPlanes,setInitialStateController,setResumen} = controlerSlice.actions
export default controlerSlice.reducer