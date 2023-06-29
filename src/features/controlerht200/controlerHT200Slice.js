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
        secuencias:[{ring1:[{id: "paso-1",value: 0,ring: 1},],ring2:[{id: "paso-1",value: 0,ring: 1}],ring3:[{id: "paso-1",value: 0,ring: 1}],ring4:[{id: "paso-1",value: 0,ring: 1}]}],
        split:[{data:[]}],
        pattern:[{}],
        acciones:[],
        plan:[{data:[]}],
        horarios:[],
        channel:[],
        unit:{
            StartupFlash: "0",
            StartupAllRed: "0",
            AutomaticPedClear: false,
            RedRevert: "0",
            BackupTime: "0",
            BackupTime2:"0",
            FlowCycle: "0",
            FlashStatus: "0",
            Status: "0",
            GreenConflictDetectFlag: false,
            RedGreenConflictDetectFlag: false,
            RedFailedDetectFlag: false,
        },
        planificacion:[{ id: "prueba",hora:0,minuto:0, data: [{ g1: false, g2: false, g3: false, g4: false, duracion: 10, id: 1 }] }],
       
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
            state.planificacion = action.payload.planificacion;
            state.unit = action.payload.unit;
            state.historial_conexiones = action.payload.historial_conexiones;
        },
        updateParamsHT200:(state,action)=>{
            state[action.payload.target] = action.payload.data 
            
        },
        resetParamsHT200:(state)=>{
            state.canton = "";
            state.id = "";
            state.ip = "";
            state.latitud = -2.876428;
            state.longitud = -78.965342;
            state.mac = "";
            state.modelo = "";
            state.nombre = "";
            state.online = false;
            state.ultima_conexion = "";
            state.historial_conexiones=[];
            state.semaforos = []
            state.fases = []
            state.secuencias = [{ring1:[{id: "paso-1",value: 0,ring: 1},],ring2:[{id: "paso-1",value: 0,ring: 1}],ring3:[{id: "paso-1",value: 0,ring: 1}],ring4:[{id: "paso-1",value: 0,ring: 1}]}];
            state.split =[{data:[]}];
            state.pattern = [{}];
            state.acciones = [];
            state.plan = [{data:[]}];
            state.horarios = [];
            state.channel = [];
            state.unit = {
                StartupFlash: "0",
                StartupAllRed: "0",
                AutomaticPedClear: false,
                RedRevert: "0",
                BackupTime: "0",
                BackupTime2:"0",
                FlowCycle: "0",
                FlashStatus: "0",
                Status: "0",
                GreenConflictDetectFlag: false,
                RedGreenConflictDetectFlag: false,
                RedFailedDetectFlag: false,
            }
            state.planificacion = [{ id: "prueba",hora:0,minuto:0, data: [{ g1: false, g2: false, g3: false, g4: false, duracion: 10, id: 1 }] }]

        }


    }
})
export const {addFases,setInitialStateControllerHT200,setControllerDataHT200,updateParamsHT200,resetParamsHT200} = controlerHT200Slice.actions
export default controlerHT200Slice.reducer

