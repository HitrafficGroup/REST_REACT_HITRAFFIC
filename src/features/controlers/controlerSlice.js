import {createSlice} from '@reduxjs/toolkit'
import L from 'leaflet';
export const controlerSlice = createSlice({
    name: 'controlers',
    initialState: {
        ip: '',
        mac: '',
        status: '',
        latitud: -2.876428,
        longitud:-78.965342,
        fases: {},
        nombre:'',
        planes:{},
        pasos_activos:[],
        semaforos:[],
        current_controler:{},
        ips:[],
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
        },
        addIpsDisponibles:(state,action)=>{
            state.ips = action.payload
        },
        setPasosActivos:(state,action)=>{
            state.pasos_activos = action.payload
        },
        setSemaforosActivos:(state,action)=>{
            state.semaforos = action.payload
        },
        addCurrentControler:(state,action)=>{
            state.current_controler = action.payload
        }
    }
})
export const {addFases, addPlanes,setInitialStateController,setResumen,addIpsDisponibles,setPasosActivos,setSemaforosActivos,
    addCurrentControler} = controlerSlice.actions
export default controlerSlice.reducer

