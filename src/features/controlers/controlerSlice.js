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
        //datos de las config
        semaforos:[],
        fases:[],
        grupos:[],
        horario_festivo:[],
        horario_finsemana:[],
        horario_ordinario:[],
        otros_parametros:{},
        plan_1:[],
        plan_2:[],
        plan_3:[],
        plan_4:[],
        plan_5:[],
        plan_6:[],
        plan_7:[],
        plan_8:[],
       
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
            state.fases = action.payload.fases;
            state.grupos = action.payload.grupos;
            state.horario_festivo = action.payload.horario_festivo;
            state.horario_finsemana = action.payload.horario_finsemana;
            state.horario_ordinario = action.payload.horario_ordinario;
            state.otros_parametros = action.payload.otros_parametros;
            state.plan_1 = action.payload.plan_1;
            state.plan_2 = action.payload.plan_2;
            state.plan_3 = action.payload.plan_3;
            state.plan_4 = action.payload.plan_4;
            state.plan_5 = action.payload.plan_5;
            state.plan_6 = action.payload.plan_6;
            state.plan_7 = action.payload.plan_7;
            state.plan_8 = action.payload.plan_8;
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

