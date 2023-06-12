import {createSlice} from '@reduxjs/toolkit'

export const controlerSlice = createSlice({
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
        semaforos:[]
       
    },
    reducers: {
        addFases: (state,action)=>{
            state.fases = action.payload;
        },
        addPlanes: (state,action)=>{
            state.planes = action.payload;
        },
        setInitialStateController:(state,action)=>{
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
        setControllerData:(state,action)=>{
            state.semaforos = action.payload.semaforos;
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
        setSemaforos:(state,action)=>{
            state.semaforos = action.payload
        },
        addCurrentControler:(state,action)=>{
            state.current_controler = action.payload
        },
        createNewController:(state,action)=>{
            state.nuevo_controlador = action.payload
        },
        reloadIps:(state)=>{
            state.ips = []
        }

    }
})
export const {addFases, addPlanes,setInitialStateController,
    setResumen,addIpsDisponibles,
    setPasosActivos,setSemaforos,
    createNewController,addCurrentControler,reloadIps,setControllerData} = controlerSlice.actions
export default controlerSlice.reducer

