import { React, useEffect, useState } from "react"
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import RelogActual from "../components/RelogActual";
import {getTimeControlador} from '../js/apiFunctions'
import { useSelector, useDispatch } from 'react-redux';
export default function SyncTimeView() {
    const [tiempoController,setTiempoController] = useState(InitialTime)
    const [fechaController,setFechaController] = useState('Datos de fecha aun no Cargados')
    const [fechaActual,setFechaActual] = useState(new Date().toLocaleString("es-EC", { dateStyle: 'full' }))
    
    const controlerState = useSelector(state => state.controlers)
    const obtenerTiempoFromRestApi = async() =>{
        try{
            const response = await getTimeControlador(controlerState.mac,controlerState.ip)
            setTiempoController(response[controlerState.mac])
            const temp = response[controlerState.mac]
            const fechac = `${temp.mes}-${temp.dia}-${temp.year}`
            console.log(fechac)
            const dateObj = new Date(fechac)
            const formatDate = dateObj.toLocaleString("es-EC", { dateStyle: 'full' });
            setFechaController(formatDate)
            console.log(formatDate)
            console.log(response)
        }catch(e){
            console.log(e)
        }

    }
    return (<>
        <Container maxWidth="md">
            <h3>Sincronizar Hora y Fecha  Del Controlador </h3>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <h4>Datos del Computador</h4>
                </Grid>
                <Grid xs={6}>
                    <h5>Hora Actual</h5> 
                    <RelogActual/>
                </Grid>
                <Grid xs={6}>
                    <h5>Fecha Actual</h5> 
                    {fechaActual.toUpperCase()}
                </Grid>
                <Grid xs={12}>
                    <h4>Datos del Controlador</h4>
                </Grid>
                <Grid xs={6}>
                    <h5>Hora del Controlador</h5> 
                    <p>{tiempoController.horas+':'+tiempoController.minutos+':'+tiempoController.segundos}</p>
                </Grid>
                <Grid xs={6}>
                    <h5>Fecha del Controlador</h5> 
                    {fechaController.toUpperCase()}
                </Grid>
                <Grid xs={12}>
                    <h4>Funciones del Controlador</h4>
                </Grid>
                <Grid xs={3}>
                    <Button variant="contained" onClick={obtenerTiempoFromRestApi} color="verde" sx={{height:'100%'}}>
                        Obtener Tiempo
                    </Button>
                </Grid>
                <Grid xs={3}>
                    <Button variant="contained" sx={{height:'100%'}}>
                        Actualizar Tiempo
                    </Button>
                </Grid>
            </Grid>
        </Container>
    </>);
}
const InitialTime = {
    dia:"00",
    horas: "00",
    indice_dia:"00",
    mes:"00",
    minutos: "00",
    segundos:"00",
    time_zone:"00",
    year: "00"
}


const initialFecha = {
    dia: "-------",
    mes: "---------",
    dianum: "--",
    year: "----"
}