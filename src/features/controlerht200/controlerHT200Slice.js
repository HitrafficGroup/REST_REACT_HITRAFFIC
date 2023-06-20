import {createSlice} from '@reduxjs/toolkit'

export const controlerHT200Slice = createSlice({
    name: 'controlers',
    initialState: {
        canton:'',
        id:'',
        ip: '',
        latitud: -2.876428,
        longitud:-78.965342,
        mac: '',
        modelo:'',
        nombre:'',
        online:false,
        ultima_conexion:'',
        historial_conexiones:[],
        //datos de las config
        semaforos:[],
        fases:[],
        secuencias:[],
        split:[],
        pattern:[],
        acciones:[],
        plan:[],
        horarios:[],
        channel:[],
       
    },
    reducers: {
        addFases: (state,action)=>{
            state.fases = action.payload;
        },
        setInitialStateControllerHT200:(state,action)=>{
            state.canton = action.payload.canton;
            state.id = action.payload.id;
            state.ip = action.payload.ip;
            state.latitud = action.payload.latitud;
            state.longitud = action.payload.longitud;
            state.mac = action.payload.mac;
            state.modelo = action.payload.modelo;
            state.nombre = action.payload.nombre;
            state.online = action.payload.online;
            state.ultima_conexion = action.payload.ultima_conexion;
            state.historial_conexiones = action.payload.historial_conexiones;
        },
        setControllerDataHT200:(state,action)=>{
            state.semaforos = action.payload.semaforos;
            state.fases = action.payload.fases;
            state.secuencias = action.payload.secuencias;
            state.split = action.payload.split;
            state.pattern = action.payload.pattern;
            state.acciones = action.payload.acciones;
            state.plan = action.payload.plan;
            state.horarios = action.payload.horarios;
            state.channel = action.payload.channel;
        },
        updateParamsHT200:(state,action)=>{
            state[action.payload.target] = action.payload.data 
            
        }


    }
})
export const {addFases,setInitialStateControllerHT200,setControllerDataHT200,updateParamsHT200} = controlerHT200Slice.actions
export default controlerHT200Slice.reducer

